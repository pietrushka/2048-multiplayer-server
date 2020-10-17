import express from 'express'
import http from 'http'
import socketio from 'socket.io'
const cors = require('cors')
const dotenv = require('dotenv')

import {joinWaitingPlayers} from './socketsData'

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)


const getPlayersInLobby = () => {
  var players: any = [];
  const socketsIdsInLobby = Object.keys(io.sockets.adapter.rooms['lobby'].sockets)
  socketsIdsInLobby.map(socketId => players.push(io.sockets.adapter.nsp.connected[socketId]))
  
  return players;
}

io.on('connection', (socket: any) => {
  let userData = {socket, nickname: '', gameId: 'sample'}
  socket.on('join', ({nickname}: {nickname: string}) => {
    userData.nickname = nickname
    socket.join('lobby');
    const playersInLobby = getPlayersInLobby()
    if(playersInLobby.length >= 2) {
      const gameId = joinWaitingPlayers(playersInLobby)
      if(gameId) {
        userData.gameId = gameId
        console.log(gameId)
        io.to(gameId).emit('start-game', {gameId});
      }
    }
  })

  


  socket.on('move', (data: any) => {
    const {board, score} = data
    const gameSocketId = Object.keys(socket.rooms)[1]
    socket.to(gameSocketId).emit('move', {board, score})
  })

  socket.on('disconnect', function () {
  })
})

server.listen(PORT, () => console.log('server runnin on port 4000'))
