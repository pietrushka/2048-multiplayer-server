import { Server } from "socket.io"
import http from "http"
import ConnectionManager from "./ConnectionManager"
import cookieParser from "cookie-parser"

export default function SocketServer(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
    connectionStateRecovery: {},
    // cookie: true, // TODO sticky session with clusters
  })

  io.engine.use(cookieParser())

  const connectionoManager = new ConnectionManager(io)
  return connectionoManager
}
