import { IPlayer } from "./types"
import express from 'express'
import http from 'http'
import socketio from 'socket.io'
const cors = require('cors')
const dotenv = require('dotenv')

import {addPlayer} from './socketsData'

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket: any) => {
  socket.on('join', ({nickname, playerId, roomId}: IPlayer) => {
    addPlayer({nickname, playerId, roomId})
    console.log('new player', {nickname, playerId, roomId})
  })

  socket.on('disconnect', function () {
  })
})

server.listen(PORT, () => console.log('server runnin on port 4000'))
