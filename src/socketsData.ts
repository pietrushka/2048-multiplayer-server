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
const gameRooms: { [key: string]: IgameRoom; }  = {}



export const addPlayer = ({nickname, playerId, roomId}: IPlayer) => {
  if(!gameRooms[roomId]) gameRooms[roomId].players = [{playerId, nickname}]
  gameRooms[roomId].players.push({playerId, nickname})
}