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
import serverEmitter from "./serverEmitter"

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
        console.error("no user connected with:", socketId)
      }
    }
  }
  handleDisconnect(socket: socketio.Socket) {
    return () => {
      const socketId = socket.id
      const user = this.users.get(socketId)
      const gameId = user ? user.gameId : null

      if (gameId && this.games.get(gameId)) {
        this.endGame(gameId)
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
    game.startGame()
    serverEmitter(this.io, {
      signal: SIGNALS.startGame,
      gameId: game.id,
      data: game.data,
    })
  }

  handleMove(socket: socketio.Socket) {
    return (data: { move: Move }) => {
      const socketId = socket.id
      const user = this.users.get(socketId)
      const gameId = user.gameId
      const game = this.games.get(gameId)

      if (!game) {
        // TODO or player not in this game
        console.error("ERROR no game id !!!")
        return
      }

      game.handleMove(data.move, socketId)

      serverEmitter(this.io, {
        signal: SIGNALS.boardUpdate,
        gameId,
        data: game.data,
      })
    }
  }

  stopLobbyCheck() {
    clearInterval(this.lobbyCheckInterval)
  }

  endGame(gameId: string) {
    const game = this.games.get(gameId)
    // TODO to do handle player disconnect case
    game.handleGameEnd({ reason: "timeEnd" })
    serverEmitter(this.io, {
      signal: SIGNALS.endGame,
      gameId,
      data: game.data,
    })
  }
}
