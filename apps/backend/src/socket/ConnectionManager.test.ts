import { createServer, Server as HttpServer } from "node:http"
import { AddressInfo } from "node:net"
import { io as ioc, Socket as ClientSocket } from "socket.io-client"
import { Server, Socket as ServerSocket } from "socket.io"
import ConnectionManager from "./ConnectionManager"
import MultiplayerGame from "../gameLogic/MultiplayerGame"
import { StartGamePayload, MOVES, CLIENT_SIGNALS, SERVER_SIGNALS } from "shared-logic"

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve)
  })
}

const createBoardData = (playerId: string) => ({
  playerId,
  score: expect.any(Number),
  tileGridStateEncoded: expect.any(String),
})

const joinPlayers = async ({
  clientSocket1,
  clientSocket2,
  nickname1,
  nickname2,
}: {
  clientSocket1: ClientSocket
  clientSocket2: ClientSocket
  nickname1: string
  nickname2: string
}) => {
  clientSocket1.emit(CLIENT_SIGNALS.join, { nickname: nickname1 })
  clientSocket2.emit(CLIENT_SIGNALS.join, { nickname: nickname2 })

  // Promise.all is essential for it to work
  const result = (await Promise.all([
    waitFor(clientSocket1, SERVER_SIGNALS.startGame),
    waitFor(clientSocket2, SERVER_SIGNALS.startGame),
  ])) as [StartGamePayload, StartGamePayload]
  return result
}

const blockPlayer1 = (connectionManager: ConnectionManager, clientSocket1: ClientSocket, playerId1: string) => {
  const boards = [...connectionManager.games.values()][0].boards
  const player1Board = boards.find((x) => x.playerId === playerId1)!
  player1Board.score = 50
  player1Board.tileGrid = [
    [2, 16, 4, 2],
    [8, 4, 2, 4],
    [32, 2, 4, 2],
    [64, 0, 2, 4],
  ]
  clientSocket1.emit(CLIENT_SIGNALS.move, { move: MOVES.RIGHT })
}

describe("WHOLE GAME FLOW", () => {
  const nickname1 = "player1"
  const nickname2 = "player2"
  let io: Server,
    clientSocket1: ClientSocket,
    clientSocket2: ClientSocket,
    connectionManager: ConnectionManager,
    httpServer: HttpServer,
    playerId1: string,
    playerId2: string

  beforeEach((done) => {
    httpServer = createServer()
    io = new Server(httpServer)
    connectionManager = new ConnectionManager(io) // Assuming ConnectionManager is already imported

    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port

      clientSocket1 = ioc(`http://localhost:${port}`)
      clientSocket2 = ioc(`http://localhost:${port}`)

      let connections = 0 // to make sure both are loaded
      clientSocket1.on("connect", () => {
        playerId1 = clientSocket1.id!
        connections++
        if (connections === 2) done()
      })
      clientSocket2.on("connect", () => {
        playerId2 = clientSocket2.id!
        connections++
        if (connections === 2) done()
      })
    })
  })

  afterEach(() => {
    httpServer.close()
    io.close()
    clientSocket1.close()
    clientSocket2.close()
    connectionManager.stopLobbyCheck()
  })

  test("join of a 2 players should start game", async () => {
    const [socket1Data, socket2Data] = await joinPlayers({
      clientSocket1,
      clientSocket2,
      nickname1,
      nickname2,
    })

    // validate emitted data
    const expectedSocketData = {
      status: "active",
      endGameTimestamp: expect.any(String),
      boards: expect.arrayContaining([createBoardData(playerId1), createBoardData(playerId2)]),
    }
    expect(socket1Data).toEqual(expectedSocketData)
    expect(socket2Data).toEqual(expectedSocketData)

    // validate ConnectionManager state
    const { games, users, lobbyUsers } = connectionManager

    expect(lobbyUsers.size).toBe(0)

    expect(games.size).toBe(1)
    const [game] = [...games.values()]
    expect(game.status).toBe("active")
    expect(game.endGameTimestamp).toEqual(expect.any(String))

    const usersArr = [...users.values()]
    expect(usersArr).toEqual([
      {
        socket: expect.any(ServerSocket),
        nickname: nickname1,
        gameId: game.id,
      },
      {
        socket: expect.any(ServerSocket),
        nickname: nickname2,
        gameId: game.id,
      },
    ])
  })

  test("moves", async () => {
    await joinPlayers({
      clientSocket1,
      clientSocket2,
      nickname1,
      nickname2,
    })

    const handleMoveSpy = jest.spyOn(MultiplayerGame.prototype, "handleMove")
    clientSocket1.emit(CLIENT_SIGNALS.move, { move: MOVES.UP })

    await Promise.all([
      waitFor(clientSocket1, SERVER_SIGNALS.boardUpdate),
      waitFor(clientSocket2, SERVER_SIGNALS.boardUpdate),
    ])

    expect(handleMoveSpy).toHaveBeenCalledWith(MOVES.UP, playerId1)
  })

  test("gameEnd - player blocked", async () => {
    await joinPlayers({
      clientSocket1,
      clientSocket2,
      nickname1,
      nickname2,
    })

    blockPlayer1(connectionManager, clientSocket1, playerId1)

    const [socket1Data, socket2Data] = await Promise.all([
      waitFor(clientSocket1, SERVER_SIGNALS.endGame),
      waitFor(clientSocket2, SERVER_SIGNALS.endGame),
    ])

    const expectedSocketData = {
      status: "finished",
      endGameTimestamp: expect.any(String),
      boards: expect.arrayContaining([createBoardData(playerId1), createBoardData(playerId2)]),
      winner: playerId2,
    }
    expect(socket1Data).toEqual(expectedSocketData)
    expect(socket2Data).toEqual(expectedSocketData)
  })

  test("play again", async () => {
    const users = [...connectionManager.users.values()]
    await joinPlayers({
      clientSocket1,
      clientSocket2,
      nickname1,
      nickname2,
    })
    blockPlayer1(connectionManager, clientSocket1, playerId1)
    await Promise.all([waitFor(clientSocket1, SERVER_SIGNALS.endGame), waitFor(clientSocket2, SERVER_SIGNALS.endGame)])

    // player1 left game, joined lobby
    clientSocket1.emit(CLIENT_SIGNALS.playAgain)
    await waitFor(clientSocket1, SERVER_SIGNALS.joinLobby)
    const user1PostLeft = users.find((x) => x.socket.id === playerId1)!
    expect(user1PostLeft.gameId).toBe(null)
    // player2 still in game
    const user2PreLeft = users.find((x) => x.socket.id === playerId2)!
    expect(user2PreLeft.gameId).toEqual(expect.any(String))

    // player2 left game, joined lobby
    clientSocket2.emit(CLIENT_SIGNALS.playAgain)
    await waitFor(clientSocket2, SERVER_SIGNALS.joinLobby)
    const user2PostLeft = users.find((x) => x.socket.id === playerId2)!
    expect(user2PostLeft.gameId).toBe(null)

    // New game starts
    await Promise.all([
      waitFor(clientSocket1, SERVER_SIGNALS.startGame),
      waitFor(clientSocket2, SERVER_SIGNALS.startGame),
    ])

    // Both players in new game
    const user1PostJoin = users.find((x) => x.socket.id === playerId1)!
    expect(user1PostJoin.gameId).toEqual(expect.any(String))
    const user2PostJoin = users.find((x) => x.socket.id === playerId2)!
    expect(user2PostJoin.gameId).toEqual(expect.any(String))
  })
})
