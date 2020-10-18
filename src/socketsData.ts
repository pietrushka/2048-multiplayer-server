import { v4 as uuidv4 } from 'uuid';

const games: any = {

}

export const joinWaitingPlayers = (playersInLobby: any) => {
  const gameId = `game ${uuidv4()}`

  games[gameId] = {
    players: [playersInLobby[0].id, playersInLobby[1].id],
  }

  playersInLobby[0].leave('lobby');
  playersInLobby[1].leave('lobby');
  playersInLobby[0].join(gameId);
  playersInLobby[1].join(gameId);

  return gameId
}

