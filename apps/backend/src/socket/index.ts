import { Server } from "socket.io"
import http from "http"
import ConnectionManager from "./ConnectionManager"
import cookieParser from "cookie-parser"
import { corsOptions } from "../config"

export default function SocketServer(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: corsOptions,
  })

  io.engine.use(cookieParser())

  const connectionoManager = new ConnectionManager(io)
  return connectionoManager
}
