import { IPlayer } from "./types"
import express from 'express'
import http from 'http'
import socketio from 'socket.io'
const cors = require('cors')
const dotenv = require('dotenv')

import {addPlayer, movePlayerToNewRoom} from './socketsData'

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)

io.on('connection', (socket: any) => {
  socket.on('join', ({nickname, playerId}: IPlayer) => {
    const roomId = 'lobby'
    const socketId = socket.id
    const opponent = addPlayer({nickname, playerId, socketId, roomId})
    
    if(opponent) {
      const players = [{nickname, playerId}, opponent]
      console.log('on connection', players)
      const newRoomId = movePlayerToNewRoom(players)
      socket.to(newRoomId).emit('game-start', {roomId: newRoomId})
    }
  })

  socket.on('move', (data: any) => {
    const {roomId, board, score} = data

    socket.to(roomId).emit('drawing', {board, score})
  })

  socket.on('disconnect', function () {
  })
})

server.listen(PORT, () => console.log('server runnin on port 4000'))
