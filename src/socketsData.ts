import { v4 as uuidv4 } from 'uuid';

import { IPlayer } from "./types"

interface playerType {
  playerId: string;
  nickname: string;
  board?: number[];
  score?: number;
}
interface IgameRoom {
  players: playerType[]
}
const gameRooms: { [key: string]: IgameRoom; } = {
  'lobby': {
    players: []
  }
}

const findOpponent = () => {
  // get first player in lobby
  const opponent = gameRooms.lobby.players.shift()
  return opponent
}

export const addPlayer = (player: any) => {
  if(gameRooms.lobby.players.length === 0) {
    gameRooms['lobby'].players.push(player)
    return undefined
  }

  const opponent = findOpponent()
  return opponent ? opponent : undefined
}

export const movePlayerToNewRoom = (players: any) => {
  const newRoomId = uuidv4()
  gameRooms[newRoomId] = {players: []}
  players.map((player: IPlayer) => player.roomId = newRoomId)
  gameRooms[newRoomId].players = players
  console.log('movePlayerToNewRoom', players)

  return newRoomId
}

