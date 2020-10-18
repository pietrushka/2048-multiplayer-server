import { v4 as uuidv4 } from 'uuid';

const games: any = {

}

export const joinWaitingPlayers = (playersInLobby: any) => {
  const gameId = `game ${uuidv4()}`

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

export const trowPlayersOut  = (playersInRoom: any, gameId: string) => {
  delete games[gameId]
  playersInRoom.map((player: any) => {
    player.leave(gameId)
  })
}


