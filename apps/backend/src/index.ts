import express from "express"
import cors from "cors"
import http from "http"
import SocketServer from "./socket"

const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())
const httpServer = http.createServer(app)

app.get("/", (req, res) => {
  res.json({ message: "ok" })
})

SocketServer(httpServer)

httpServer.listen(PORT, () => console.log(`server runnin on port ${PORT}`))
