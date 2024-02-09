import express from 'express'
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'
import crypto from 'crypto'

const PORT = 4000

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server);

const games: any = {

}

const joinWaitingPlayers = (playersInLobby: any) => {
  const gameId = `game ${crypto.randomUUID()}`

  // create game room
  games[gameId] = {
    players: [],
  }

  playersInLobby.map((player: any) => {
    player.leave('lobby');
    player.join(gameId);
    games[gameId].players.push(player.id)
  })

  return gameId
}

const trowPlayersOut  = (playersInRoom: any, gameId: string) => {
  delete games[gameId]
  playersInRoom.map((player: any) => {
    player.leave(gameId)
  })
}

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
    const {board: opponentBoard, score: opponentScore} = data
    const gameSocketId = Object.keys(socket.adapter.rooms).find(room => room.includes('game'))
    socket.to(gameSocketId).emit('move', {opponentBoard, opponentScore})
  })

  socket.on('game-event', (eventType: string) => {
    const gameSocketId = Object.keys(socket.adapter.rooms).find(room => room.includes('game'))
    socket.to(gameSocketId).emit('game-event', eventType)
  })

  socket.on('player-lost', () => {
    const gameSocketId = Object.keys(socket.adapter.rooms).find(room => room.includes('game'))
    console.log('opponent lost')
    socket.to(gameSocketId).emit('opponent-lost')
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

server.listen(PORT, () => console.log(`server runnin on port ${PORT}`))