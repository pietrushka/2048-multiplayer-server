import socketio from "socket.io"
import Game from "../gameLogic/MultiplayerGame"
import User from "./User"
import {
  chunk,
  MIN_PLAYERS_TO_START,
  CLIENT_SIGNALS,
  LOBBY_CHECK_INTERVAL_MS,
  Move,
  isStartGamePayload,
} from "shared-logic"
import ServerEmitter from "./ServerEmitter"

export default class ConnectionManager {
  users: Map<string, User>
  games: Map<string, Game>
  lobbyUsers: Set<string>
  private lobbyCheckInterval
  serverEmitter: ServerEmitter

  constructor(private io: socketio.Server) {
    this.users = new Map()
    this.games = new Map()

    this.lobbyUsers = new Set()

    this.serverEmitter = new ServerEmitter(io)

    this.io.on("connection", (socket: socketio.Socket) => {
      this.handleConnection(socket)
    })

    // Start the lobby check timer
    this.lobbyCheckInterval = setInterval(() => this.checkLobby(), LOBBY_CHECK_INTERVAL_MS)
  }

  handleConnection = (socket: socketio.Socket) => {
    console.info(`New connection: ${socket.id}`)
    const user = new User(socket)
    this.users.set(socket.id, user)

    socket.on(CLIENT_SIGNALS.join, this.handleJoin(socket))
    socket.on(CLIENT_SIGNALS.disconnect, this.handleDisconnect(socket))
    socket.on(CLIENT_SIGNALS.move, this.handleMove(socket))
    socket.on(CLIENT_SIGNALS.playAgain, this.handlePLayAgain(socket))
  }

  handleJoin(socket: socketio.Socket) {
    return (data: { nickname: string }) => {
      const socketId = socket.id
      const user = this.users.get(socketId)
      if (user) {
        user.nickname = data.nickname
        socket.join("lobby")
        this.lobbyUsers.add(socket.id)
      } else {
        console.error("handleJoin: no user connected with:", socketId)
      }
    }
  }
  handleDisconnect(socket: socketio.Socket) {
    return () => {
      const socketId = socket.id
      const user = this.users.get(socketId)

      if (user) {
        this.userDisconnectHandleGame(user)
      } else {
        console.error("handleDisconnect: no user", { socketId })
      }

      this.users.delete(socketId)
      console.info(`Disconnected: ${socketId}`)
    }
  }

  checkLobby() {
    const playerChunks = chunk(Array.from(this.lobbyUsers), MIN_PLAYERS_TO_START)

    for (const players of playerChunks) {
      if (players.length === MIN_PLAYERS_TO_START) {
        this.createGame(players)
      }
    }
  }

  createGame(players: string[]) {
    const game = new Game(this.serverEmitter, players)
    this.games.set(game.id, game)

    players.forEach((playerId) => {
      const user = this.users.get(playerId)
      if (user) {
        user.gameId = game.id
        user.socket.join(game.id)
        this.lobbyUsers.delete(playerId)
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

  handleMove(socket: socketio.Socket) {
    return (data: { move: Move }) => {
      const socketId = socket.id

      const user = this.users.get(socketId)
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

      game.handleMove(data.move, socketId)

      this.serverEmitter.sendBoardUpdate(game.id, game.data)
    }
  }

  stopLobbyCheck() {
    clearInterval(this.lobbyCheckInterval)
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
    const isOnlyPlayer = game.socketIds.length < 2

    if (isOnlyPlayer) {
      this.games.delete(game.id)
    }
  }

  handlePLayAgain(socket: socketio.Socket) {
    return () => {
      const socketId = socket.id
      const user = this.users.get(socketId)
      if (user) {
        this.userDisconnectHandleGame(user)
        user.gameId = null
        socket.join("lobby")
        this.lobbyUsers.add(socket.id)
        this.serverEmitter.sendJoinLobby(socketId)
      } else {
        console.error("handlePLayAgain: no user connected with:", socketId)
      }
    }
  }
}
