import socketio from "socket.io"
import cookie from "cookie"
import { chunk, CLIENT_SIGNALS, COOKIE_NAMES, Direction, JoinPrivateGamePayload } from "shared-logic"
import Game, { Player } from "../gameLogic/MultiplayerGame"
import User from "./User"
import ServerEmitter from "./ServerEmitter"
import authenticateToken from "../utils/authenticateToken"
import { Bot } from "../simulation/bot"
import { generateRoomName } from "../gameLogic/roomUtils"
import PublicLobby from "./PublicLobby"
import PrivateLobby from "./PrivateLobby"

const MIN_PLAYERS_TO_START = 2

const LOBBY_CHECK_INTERVAL_MS = 2000
const CLEAN_UP_INTERVAL_MS = 2000 // 5min * 60s * 1000ms

function authPlayer(handshake: socketio.Socket["handshake"]) {
  const playerIdentifier = handshake.query?.[COOKIE_NAMES.PLAYER_IDENTIFIER] as string | undefined
  if (!playerIdentifier) {
    return
  }

  const cookieString = handshake.headers.cookie as string | undefined
  if (!cookieString) {
    return { playerIdentifier, userId: undefined }
  }

  const parsedCookies = cookie.parse(cookieString)
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

export default class ConnectionManager {
  users: Map<string, User>
  games: Map<string, Game>

  publicLobby = new PublicLobby()

  privateLobbies: Map<string, PrivateLobby> = new Map()
  private lobbyCheckInterval
  private cleanUpInterval
  serverEmitter: ServerEmitter

  constructor(private io: socketio.Server) {
    this.users = new Map()
    this.games = new Map()

    this.serverEmitter = new ServerEmitter(io)

    this.io.on("connection", this.handleConnection)

    this.lobbyCheckInterval = setInterval(() => this.checkLobby(), LOBBY_CHECK_INTERVAL_MS)
    this.cleanUpInterval = setInterval(() => this.cleanUp(), CLEAN_UP_INTERVAL_MS)
  }

  handleConnection = (socket: socketio.Socket) => {
    const authResult = authPlayer(socket.handshake)
    if (!authResult) {
      console.error("authPlayer failed", socket.handshake)
      return
    }

    const { playerIdentifier, userId } = authResult
    const user = new User({ socket, userId, playerIdentifier })
    this.users.set(playerIdentifier, user)

    socket.on(CLIENT_SIGNALS.join, this.handleJoin(socket, playerIdentifier))
    socket.on(CLIENT_SIGNALS.joinPrivateGame, this.handleJoinPrivateGame(socket, playerIdentifier))
    socket.on(CLIENT_SIGNALS.disconnect, this.handleDisconnect(socket, playerIdentifier))
    socket.on(CLIENT_SIGNALS.move, this.handleMove(socket, playerIdentifier))
    socket.on(CLIENT_SIGNALS.playAgain, this.handlePLayAgain(socket, playerIdentifier))
  }

  handleJoin(socket: socketio.Socket, playerIdentifier: string) {
    return () => {
      const user = this.users.get(playerIdentifier)

      if (!user) {
        console.error("handleJoin: no user connected with:", playerIdentifier)
        return
      }

      this.publicLobby.join(user)
    }
  }

  handleJoinPrivateGame(socket: socketio.Socket, playerIdentifier: string) {
    return (data: JoinPrivateGamePayload) => {
      const user = this.users.get(playerIdentifier)

      if (!user) {
        console.error("handleJoinPrivateGame: no user connected with:", playerIdentifier)
        return
      }

      if (data.privateLobbyId) {
        const privateLobby = this.privateLobbies.get(data.privateLobbyId)
        if (!privateLobby) {
          console.error("handleJoinPrivateGame: no privateLobby", { data })
          return
        }

        privateLobby.join(user)
        this.createGame(privateLobby.players)

        this.privateLobbies.delete(data.privateLobbyId)
        privateLobby.players.forEach((user) => user.socket.leave(privateLobby.id))
      }

      const privateLobby = new PrivateLobby({ host: user })
      this.privateLobbies.set(privateLobby.id, privateLobby)
      this.serverEmitter.sendJoinPrivateLobby(socket.id, { privateLobbyId: privateLobby.id })
    }
  }

  handleDisconnect(socket: socketio.Socket, userId: string) {
    return () => {
      const user = this.users.get(userId)

      if (user) {
        this.userDisconnectHandleGame(user)
        this.users.delete(userId)
        this.publicLobby.throwUserOut(user)
        this.privateLobbies.delete(generateRoomName("privateLobby", user.playerIdentifier))
        console.info(`Disconnected: ${userId}`)
      } else {
        console.error("handleDisconnect: no user", { userId })
      }
    }
  }

  checkLobby() {
    const playerChunks = chunk(this.publicLobby.userArray, MIN_PLAYERS_TO_START)

    for (const players of playerChunks) {
      if (players.length === MIN_PLAYERS_TO_START) {
        this.createGame(players)
        continue
      }

      // simulate random wait time in lobby
      if (Math.random() > 0.8) {
        this.createGame([players[0], new Bot()])
      }
    }
  }

  createGame(players: Player[]) {
    const game = new Game({
      serverEmitter: this.serverEmitter,
      players,
    })
    this.games.set(game.id, game)

    players.forEach((player) => {
      // player might be a bot
      if (player instanceof User) {
        this.publicLobby.throwUserOut(player)
        player.gameId = game.id
        player.socket.join(game.id)
      }
    })

    game.runGame()
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
        this.publicLobby.join(user)
        this.serverEmitter.sendJoinLobby(socket.id) // TODO
      } else {
        console.error("handlePLayAgain: no user connected with:", userId)
      }
    }
  }

  resetState() {
    this.users.clear()
    this.games.clear()
    this.publicLobby.clear()
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
