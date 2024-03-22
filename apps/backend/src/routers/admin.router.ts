import { Router } from "express"
import ConnectionManager from "../socket/ConnectionManager"
import { adminAuth } from "../middlewares/adminAuth"

export default class AdminRouter {
  public router: Router
  public connectionManager: ConnectionManager

  constructor(connectionManager: ConnectionManager) {
    this.router = Router()
    this.connectionManager = connectionManager
    this.registerRoutes()
  }

  registerRoutes() {
    this.router.get("/state", adminAuth, (req, res) => {
      const users = [...this.connectionManager.users].map(([_, { socket, nickname, gameId }]) => ({
        socketId: socket.id,
        nickname,
        gameId,
      }))
      const lobby = [...this.connectionManager.lobbyUsers]
      const games = [...this.connectionManager.games].map(
        ([_, { id, status, endGameTimestamp, winner, socketIds }]) => ({
          id,
          status,
          endGameTimestamp,
          winner,
          socketIds,
        }),
      )
      res.json({ users, lobby, games })
    })

    this.router.post("/reset", adminAuth, (req, res) => {
      this.connectionManager.resetState()
      res.status(200).send("ok")
    })
  }
}
