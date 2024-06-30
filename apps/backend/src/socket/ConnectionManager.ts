import socketio from "socket.io"
import cookie from "cookie"
import { chunk, CLIENT_SIGNALS, COOKIE_NAMES, Direction } from "shared-logic"
import Game, { Player } from "../gameLogic/MultiplayerGame"
import User from "./User"
import ServerEmitter from "./ServerEmitter"
import authenticateToken from "../utils/authenticateToken"
import { Bot } from "../simulation/bot"

const MIN_PLAYERS_TO_START = 2

const LOBBY_CHECK_INTERVAL_MS = 2000
const CLEAN_UP_INTERVAL_MS = 2000 // 5min * 60s * 1000ms

function authPlayer(cookieString: string) {
  const parsedCookies = cookie.parse(cookieString)

  const playerIdentifier = parsedCookies[COOKIE_NAMES.PLAYER_IDENTIFIER] as string | undefined
  if (!playerIdentifier) {
    return
  }
  const accessToken = parsedCookies[COOKIE_NAMES.ACCESS_TOKEN] as string | undefined
  const tokenResult = authenticateToken(accessToken)

  if (tokenResult.isValid) {
    return {
      playerIdentifier,
      userId: tokenResult.userId,
    }
  }

  return { playerIdentifier, userId: undefined }
}

// TODO change name
export default class ConnectionManager {
  users: Map<string, User>
  games: Map<string, Game>
  lobbyUsers: Set<string>
  private lobbyCheckInterval
  private cleanUpInterval
  serverEmitter: ServerEmitter

  constructor(private io: socketio.Server) {
    this.users = new Map()
    this.games = new Map()

    this.lobbyUsers = new Set()

    this.serverEmitter = new ServerEmitter(io)

    this.io.on("connection", this.handleConnection)

    this.lobbyCheckInterval = setInterval(() => this.checkLobby(), LOBBY_CHECK_INTERVAL_MS)

    this.cleanUpInterval = setInterval(() => this.cleanUp(), CLEAN_UP_INTERVAL_MS)
  }

  handleConnection = (socket: socketio.Socket) => {
    const authResult = authPlayer(socket.handshake.headers.cookie as string)
    if (!authResult) {
      return
    }
    const { playerIdentifier, userId } = authResult
    const user = new User({ socket, userId, playerIdentifier })
    this.users.set(playerIdentifier, user)

    socket.on(CLIENT_SIGNALS.join, this.handleJoin(socket, playerIdentifier))
    socket.on(CLIENT_SIGNALS.disconnect, this.handleDisconnect(socket, playerIdentifier))
    socket.on(CLIENT_SIGNALS.move, this.handleMove(socket, playerIdentifier))
    socket.on(CLIENT_SIGNALS.playAgain, this.handlePLayAgain(socket, playerIdentifier))
  }

  handleJoin(socket: socketio.Socket, playerIdentifier: string) {
    return (data: { nickname: string }) => {
      const user = this.users.get(playerIdentifier)
      if (user) {
        user.nickname = data.nickname
        socket.join("lobby")
        this.lobbyUsers.add(playerIdentifier)
      } else {
        console.error("handleJoin: no user connected with:", playerIdentifier)
      }
    }
  }
  handleDisconnect(socket: socketio.Socket, userId: string) {
    return () => {
      const user = this.users.get(userId)

      if (user) {
        this.userDisconnectHandleGame(user)
      } else {
        console.error("handleDisconnect: no user", { userId })
      }

      this.users.delete(userId)
      console.info(`Disconnected: ${userId}`)
    }
  }

  checkLobby() {
    if (this.lobbyUsers.size === 1) {
      const playerId = Array.from(this.lobbyUsers)[0]
      const player = this.users.get(playerId)
      if (!player) {
        console.error("checkLobby: no player", { playerId })
        return
      }
      const bot = new Bot()
      const players = [player, bot]
      this.createGame(players)
    }

    const playerChunks = chunk(Array.from(this.lobbyUsers), MIN_PLAYERS_TO_START)

    for (const playerIds of playerChunks) {
      const players = playerIds.map((id) => this.users.get(id)).filter((user): user is User => user instanceof User)
      if (players.length === MIN_PLAYERS_TO_START) {
        this.createGame(players)
      }
    }
  }

  createGame(players: Player[]) {
    const game = new Game(this.serverEmitter, players)
    this.games.set(game.id, game)

    players.forEach((player) => {
      // player might be a bot
      const user = this.users.get(player.playerIdentifier)
      if (user) {
        user.gameId = game.id
        user.socket.join(game.id)
        this.lobbyUsers.delete(player.playerIdentifier)
      }
    })

    game.startGame()
  }

  handleMove(socket: socketio.Socket, userId: string) {
    return (data: { move: Direction }) => {
      const user = this.users.get(userId)
      if (!user) {
        console.error("handleMove: no user")
        return
      }

      const gameId = user.gameId
      if (!gameId) {
        console.error("handleMove: no game.id", { user })
        return
      }

      const game = this.games.get(gameId)
      if (!game) {
        console.error("handleMove: no game", { gameId })
        return
      }

      game.handleMove(data.move, userId)
    }
  }

  userDisconnectHandleGame(user: User) {
    if (!user.gameId) {
      return
    }

    const game = this.games.get(user.gameId)

    if (!game) {
      console.error("userDisconnectHandleGame: no game", { user })
      return
    }

    if (game.status !== "finished") {
      // TODO to do handle player disconnect case
      game.handleGameEnd({ reason: "timeEnd" })
    }
    const isOnlyPlayer = game.players.length < 2

    if (isOnlyPlayer) {
      this.games.delete(game.id)
    }
  }

  handlePLayAgain(socket: socketio.Socket, userId: string) {
    return () => {
      const user = this.users.get(userId)
      if (user) {
        this.userDisconnectHandleGame(user)
        user.gameId = null
        socket.join("lobby")
        this.lobbyUsers.add(userId)
        this.serverEmitter.sendJoinLobby(socket.id)
      } else {
        console.error("handlePLayAgain: no user connected with:", userId)
      }
    }
  }

  resetState() {
    this.users.clear()
    this.games.clear()
    this.lobbyUsers.clear()
    console.info("State has been reset")
  }

  cleanUp() {
    // TODO improve the cleanup
    for (const [gameId, game] of this.games) {
      if (game.status === "finished") {
        this.games.delete(gameId)
      }
    }
  }

  stopIntervals() {
    clearInterval(this.lobbyCheckInterval)
    clearInterval(this.cleanUpInterval)
  }
}
