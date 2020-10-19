import express from 'express'
import http from 'http'
import socketio from 'socket.io'
const cors = require('cors')
const dotenv = require('dotenv')

import {joinWaitingPlayers, trowPlayersOut} from './socketsData'

dotenv.config({ path: './config.env' })
const PORT = process.env.PORT || 4000

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)


const getPlayersInRoom = (room: string) => {
  var players: any = [];
  const socketsIdsInLobby = Object.keys(io.sockets.adapter.rooms[room].sockets)
  socketsIdsInLobby.map(socketId => players.push(io.sockets.adapter.nsp.connected[socketId]))
  
  return players;
}

io.on('connection', (socket: any) => {
  let userData = {socket, nickname: ''}
  socket.on('join', async ({nickname}: {nickname: string}) => {
    console.log('player joined')
    userData.nickname = nickname
    socket.join('lobby');
    const playersInLobby = getPlayersInRoom('lobby')
    if(playersInLobby.length >= 2) {
      const gameId = await joinWaitingPlayers(playersInLobby)
      const gameTime = 300000
      if(gameId) {
        io.to(gameId).emit('start-game', {gameId, gameTime});
        setTimeout(() => {
          io.to(gameId).emit('end-game', {result: 'chicken'});
          }, gameTime)
      }
    }
  })

  socket.on('move', (data: any) => {
    const {board, score} = data
    const gameSocketId = Object.keys(socket.rooms)[1]
    socket.to(gameSocketId).emit('move', {board, score})
  })

  socket.on('game-event', (eventType: string) => {
    const gameSocketId = Object.keys(socket.rooms)[1]
    socket.to(gameSocketId).emit('game-event', eventType)
  })

  socket.on('disconnect', function () {
    const gameId = Object.keys(socket.adapter.rooms).find(room => room.includes('game'))
    if(gameId) {
      io.to(gameId).emit('end-game', {result: 'chicken'});
      const playersInRoom = getPlayersInRoom(gameId)
      trowPlayersOut(playersInRoom, gameId)
    }
  })
})

server.listen(PORT, () => console.log('server runnin on port 4000'))
