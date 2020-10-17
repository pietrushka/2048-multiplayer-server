import { v4 as uuidv4 } from 'uuid';

export const joinWaitingPlayers = (playersInLobby: any) => {
  const gameId = `game ${uuidv4()}`

  playersInLobby[0].leave('lobby');
  playersInLobby[1].leave('lobby');
  playersInLobby[0].join(gameId);
  playersInLobby[1].join(gameId);

  return gameId
}