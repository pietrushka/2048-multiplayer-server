import { Server } from "socket.io"
import http from "http"
import ConnectionManager from "./ConnectionManager"

export default function SocketServer(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  })

  new ConnectionManager(io)
}
