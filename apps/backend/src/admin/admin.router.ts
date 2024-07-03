import { Router } from "express"
import ConnectionManager from "../socket/ConnectionManager"
import { adminAuth } from "./adminAuth"
import sql from "../db/sql"
import { createTokensTable, createUsersTable } from "../db/createTables"
import { seedUsers } from "../db/seed"

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
      const users = [...this.connectionManager.users].map(([_, x]) => x.data)
      const lobby = this.connectionManager.publicLobby.userArray.map((x) => x.data)
      const games = [...this.connectionManager.games].map(([_, { id, status, endGameTimestamp, winner, players }]) => ({
        id,
        status,
        endGameTimestamp,
        winner,
        playerIds: players.map(({ playerIdentifier, userId }) => ({ playerIdentifier, userId })),
      }))
      const privateLobbies = [...this.connectionManager.privateLobbies].map(([_, x]) => x.players.map((y) => y.data))
      res.json({ users, lobby, games, privateLobbies })
    })

    this.router.post("/reset", adminAuth, (req, res) => {
      this.connectionManager.resetState()
      res.status(200).send("ok")
    })

    this.router.get("/db-state", adminAuth, async (req, res) => {
      const dbUsers = await sql`SELECT * FROM users;`
      const dbTokens = await sql`SELECT * FROM tokens;`
      res.status(200).json({ dbUsers, dbTokens })
    })

    this.router.post("/db-reset", adminAuth, async (req, res) => {
      await sql`DROP TABLE IF EXISTS tokens;`
      await sql`DROP TABLE IF EXISTS users;`
      await createUsersTable()
      await createTokensTable()
      await seedUsers()

      res.status(200).send("db reset success")
    })
  }
}
