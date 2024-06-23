import express from "express"
import cors from "cors"
import http from "http"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import SocketServer from "./socket"
import AdminRouter from "./admin/admin.router"
import cookieParser from "cookie-parser"
import userRouter from "./user/user.router"

dotenv.config()

console.log("ENV variables:", {
  NODE_ENV: process.env.NODE_ENV,
  NODE_LOCAL_PORT: process.env.NODE_LOCAL_PORT,
  NODE_DOCKER_PORT: process.env.NODE_DOCKER_PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_SECRET_PASSWORD: process.env.ADMIN_SECRET_PASSWORD,
  POSTGRESDB_HOST: process.env.POSTGRESDB_HOST,
  POSTGRESDB_USER: process.env.POSTGRESDB_USER,
  POSTGRESDB_ROOT_PASSWORD: process.env.POSTGRESDB_ROOT_PASSWORD,
  POSTGRESDB_DATABASE: process.env.POSTGRESDB_DATABASE,
  POSTGRESDB_LOCAL_PORT: process.env.POSTGRESDB_LOCAL_PORT,
  POSTGRESDB_DOCKER_PORT: process.env.POSTGRESDB_DOCKER_PORT,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  FRONTEND_URL: process.env.FRONTEND_URL,
})

const PORT = process.env.NODE_DOCKER_PORT || 8081

const app = express()
app.use(cors({ credentials: true, origin: true, exposedHeaders: ["set-cookie"] }))

app.use(cookieParser())
app.use(bodyParser.json())
const httpServer = http.createServer(app)

// SOCKETS
const connectionManager = SocketServer(httpServer)

// REST API
app.get("/", (req, res) => {
  res.status(200).send("ok")
})

const adminRouter = new AdminRouter(connectionManager)
app.use("/admin", adminRouter.router)

app.use("/user", userRouter)

httpServer.listen(PORT, () => console.log(`server runnin on port ${PORT}`))
