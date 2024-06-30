import express from "express"
import cors from "cors"
import http from "http"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import SocketServer from "./socket"
import AdminRouter from "./admin/admin.router"
import userRouter from "./user/user.router"
import oAuthRouter from "./oAuth/oAuth.router"
import { corsOptions } from "./config"

dotenv.config()

const PORT = process.env.NODE_DOCKER_PORT || 8081

const app = express()

app.use(cors(corsOptions))

app.use(cookieParser())
app.use(bodyParser.json())
const httpServer = http.createServer(app)

const connectionManager = SocketServer(httpServer)

app.get("/", (req, res) => {
  res.status(200).send("ok")
})

const adminRouter = new AdminRouter(connectionManager)
app.use("/admin", adminRouter.router)

app.use("/user", userRouter)

app.use("/oauth", oAuthRouter)

httpServer.listen(PORT, () => console.info(`server runnin on port ${PORT}`))
