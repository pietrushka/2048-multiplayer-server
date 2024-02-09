import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import crypto from 'crypto';

const PORT = 4000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // This allows all origins. For production, replace "*" with your actual origin, e.g., "http://example.com".
    methods: ['GET', 'POST'], // Specify which HTTP methods are allowed.
    allowedHeaders: ['my-custom-header'], // Optional: specify headers
    credentials: true, // Optional: if your client needs to send cookies or credentials with the requests.
  },
});

const games: any = {};

const joinWaitingPlayers = (socketIds: string[]) => {
  const gameId = `game ${crypto.randomUUID()}`;

  // create game room
  games[gameId] = {
    players: [],
  };

  socketIds.map((socketId) => {
    const playerSocket = io.sockets.sockets.get(socketId);
    if (playerSocket) {
      playerSocket.leave('lobby');
      playerSocket.join(gameId);
    }
    games[gameId].players.push(socketId);
  });

  return gameId;
};

const trowPlayersOut = (playersInRoom: any, gameId: string) => {
  delete games[gameId];
  playersInRoom.map((player: any) => {
    player.leave(gameId);
  });
};

const getPlayersInRoom = (room) => {
  const roomObject = io.sockets.adapter.rooms.get(room);
  if (roomObject) {
    return Array.from(roomObject);
  }
  return [];
};

io.on('connection', (socket: any) => {
  let userData = { socket, nickname: '' };
  socket.on('join', async ({ nickname }: { nickname: string }) => {
    console.log('player joined');
    userData.nickname = nickname;
    socket.join('lobby');
    const socketIdsInLobby = getPlayersInRoom('lobby');
    console.log({ socketIdsInLobby });
    if (socketIdsInLobby.length >= 2) {
      const gameId = await joinWaitingPlayers(socketIdsInLobby);
      const gameTime = 300000;
      if (gameId) {
        io.to(gameId).emit('start-game', { gameId, gameTime });
        console.log('game started', io.sockets.adapter.rooms);
        setTimeout(() => {
          io.to(gameId).emit('end-game', { result: 'chicken' });
          console.log('game finished');
        }, gameTime);
      }
    }
  });

  socket.on('move', (data: any) => {
    const { board: opponentBoard, score: opponentScore } = data;
    const gameSocketId = Object.keys(socket.adapter.rooms).find((room) =>
      room.includes('game')
    );
    socket.to(gameSocketId).emit('move', { opponentBoard, opponentScore });
  });

  socket.on('game-event', (eventType: string) => {
    const gameSocketId = Object.keys(socket.adapter.rooms).find((room) =>
      room.includes('game')
    );
    socket.to(gameSocketId).emit('game-event', eventType);
  });

  socket.on('player-lost', () => {
    const gameSocketId = Object.keys(socket.adapter.rooms).find((room) =>
      room.includes('game')
    );
    console.log('opponent lost');
    socket.to(gameSocketId).emit('opponent-lost');
  });

  socket.on('disconnect', function () {
    const gameId = Object.keys(socket.adapter.rooms).find((room) =>
      room.includes('game')
    );
    if (gameId) {
      io.to(gameId).emit('end-game', { result: 'chicken' });
      const playersInRoom = getPlayersInRoom(gameId);
      trowPlayersOut(playersInRoom, gameId);
    }
  });
});

server.listen(PORT, () => console.log(`server runnin on port ${PORT}`));
