import socketio from "socket.io"
import { chunk } from "../utils"
import {
  MIN_PLAYERS_TO_START,
  SIGNALS,
  LOBBY_CHECK_INTERVAL_MS,
} from "../../../web/src/common/constants"
import { User } from "../types"
import Game from "../gameLogic/Game"
import { Server, Socket } from "socket.io"
import { Move } from "../../../web/src/common/types"

const createUserState = (socket: Socket): User => ({
  socket,
  nickname: "",
  gameId: null,
})

export default class ConnectionManager {
  users: Map<string, User>
  games: Map<string, Game>
  lobbyUsers: Set<string>
  private lobbyCheckInterval

  constructor(private io: socketio.Server) {
    this.users = new Map()
    this.games = new Map()

    this.lobbyUsers = new Set()

    this.io.on("connection", (socket: socketio.Socket) => {
      this.handleConnection(socket)
    })

    // Start the lobby check timer
    this.lobbyCheckInterval = setInterval(
      () => this.checkLobby(),
      LOBBY_CHECK_INTERVAL_MS
    )
  }

  handleConnection = (socket: socketio.Socket) => {
    console.log(`New connection: ${socket.id}`)
    const userData = createUserState(socket)
    this.users.set(socket.id, userData)

    socket.on(SIGNALS.join, this.handleJoin(socket))
    socket.on(SIGNALS.disconnect, this.handleDisconnect(socket))
    socket.on(SIGNALS.move, this.handleMove(socket))
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
        console.log("no user connected with:", socketId)
      }
    }
  }
  handleDisconnect(socket: socketio.Socket) {
    return () => {
      const socketId = socket.id
      const user = this.users.get(socketId)
      const gameId = user ? user.gameId : null

      if (gameId && this.games.get(gameId)) {
        this.endGame(this.io, gameId, "chicken")
        const isOnlyPlayer = this.games.get(gameId).socketIds.length < 2
        if (isOnlyPlayer) {
          this.games.delete(gameId)
        }
      }

      this.users.delete(socketId)
      console.log(`Disconnected: ${socketId}`)
    }
  }

  checkLobby() {
    const playerChunks = chunk(
      Array.from(this.lobbyUsers),
      MIN_PLAYERS_TO_START
    )

    for (let players of playerChunks) {
      if (players.length === MIN_PLAYERS_TO_START) {
        this.createGame(players)
      }
    }
  }

  createGame(players: string[]) {
    const game = new Game(players)
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
    console.log("startGame")
    game.startGame()
    this.io.to(game.id).emit(SIGNALS.startGame, game.data)
  }

  handleMove(socket: socketio.Socket) {
    return (data: { move: Move }) => {
      console.log("handleMove")
      const socketId = socket.id
      const user = this.users.get(socketId)
      const gameId = user.gameId
      const game = this.games.get(gameId)

      if (!game) {
        // TODO or player not in this game
        console.log("ERROR no game id !!!")
        return
      }

      game.handleMove(data.move, socketId)

      this.io.to(game.id).emit(SIGNALS.boardUpdate, game.data)
    }
  }

  stopLobbyCheck() {
    clearInterval(this.lobbyCheckInterval)
  }

  endGame(io: Server, gameId: string, result: string) {
    io.to(gameId).emit("end-game", { result })
  }
}
