import express from "express"
import cors from "cors"
import http from "http"
import SocketServer from "./socket"
import AdminRouter from "./routers/admin.router"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 8081

const app = express()
app.use(cors())
const httpServer = http.createServer(app)

// SOCKETS
const connectionManager = SocketServer(httpServer)

// REST API
app.get("/", (req, res) => {
  res.json({ message: "ok" })
})

app.get("/healthcheck", (req, res) => {
  res.status(200).send("ok")
})

const adminRouter = new AdminRouter(connectionManager)
app.use("/admin", adminRouter.router)

httpServer.listen(PORT, () => console.log(`server runnin on port ${PORT}`))
