import socketio from "socket.io"
import Game from "../gameLogic/MultiplayerGame"
import User from "./User"
import ServerEmitter from "./ServerEmitter"
import { chunk, CLIENT_SIGNALS, Move, isStartGamePayload, COOKIE_NAMES } from "shared-logic"

const MIN_PLAYERS_TO_START = 2

const LOBBY_CHECK_INTERVAL_MS = 2000
const CLEAN_UP_INTERVAL_MS = 2000 // 5min * 60s * 1000ms

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
    // @ts-expect-error - cookie vialates default request structure
    const userId = socket.request?.cookies?.[COOKIE_NAMES.PLAYER_IDENTIFIER] as string | undefined
    if (!userId) {
      console.error("no userId")
      return
    }
    const user = new User(socket, userId)
    this.users.set(userId, user)

    socket.on(CLIENT_SIGNALS.join, this.handleJoin(socket, userId))
    socket.on(CLIENT_SIGNALS.disconnect, this.handleDisconnect(socket, userId))
    socket.on(CLIENT_SIGNALS.move, this.handleMove(socket, userId))
    socket.on(CLIENT_SIGNALS.playAgain, this.handlePLayAgain(socket, userId))
  }

  handleJoin(socket: socketio.Socket, userId: string) {
    return (data: { nickname: string }) => {
      const user = this.users.get(userId)
      if (user) {
        user.nickname = data.nickname
        socket.join("lobby")
        this.lobbyUsers.add(userId)
      } else {
        console.error("handleJoin: no user connected with:", userId)
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
    const playerChunks = chunk(Array.from(this.lobbyUsers), MIN_PLAYERS_TO_START)

    for (const playerIds of playerChunks) {
      const players = playerIds.map((id) => this.users.get(id)).filter((user): user is User => user instanceof User)
      if (players.length === MIN_PLAYERS_TO_START) {
        this.createGame(players)
      }
    }
  }

  createGame(players: User[]) {
    const game = new Game(this.serverEmitter, players)
    this.games.set(game.id, game)

    players.forEach((player) => {
      const user = this.users.get(player.userId)
      if (user) {
        user.gameId = game.id
        user.socket.join(game.id)
        this.lobbyUsers.delete(player.userId)
      }
    })

    this.startGame(game)
  }

  startGame(game: Game) {
    game.startGame()
    const data = game.data
    if (isStartGamePayload(data)) {
      this.serverEmitter.sendStartGame(game.id, data)
    }
  }

  handleMove(socket: socketio.Socket, userId: string) {
    return (data: { move: Move }) => {
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

      this.serverEmitter.sendBoardUpdate(game.id, game.data)
    }
  }

  endGame(gameId: string) {
    const game = this.games.get(gameId)! // assuming there mus be a game

    // TODO to do handle player disconnect case
    game.handleGameEnd({ reason: "timeEnd" })
    this.serverEmitter.sendEndGame(game.id, game.data)
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
      this.endGame(game.id)
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
