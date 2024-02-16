import { createServer, Server as HttpServer } from "node:http"
import { AddressInfo } from "node:net"
import { io as ioc, Socket as ClientSocket } from "socket.io-client"
import { Server, Socket as ServerSocket } from "socket.io"
import ConnectionManager from "./ConnectionManager"
import { CLIENT_SIGNALS, SERVER_SIGNALS } from "../../../web/src/common/constants"

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve)
  })
}

describe("WHOLE GAME FLOW", () => {
  let io: Server,
    clientSocket1: ClientSocket,
    clientSocket2: ClientSocket,
    connectionManager: ConnectionManager,
    httpServer: HttpServer

  beforeAll((done) => {
    httpServer = createServer()
    io = new Server(httpServer)
    connectionManager = new ConnectionManager(io) // Assuming ConnectionManager is already imported

    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port
      clientSocket1 = ioc(`http://localhost:${port}`)
      clientSocket2 = ioc(`http://localhost:${port}`)
      clientSocket1.on("connect", done)
      clientSocket2.on("connect", done)
    })
  })

  afterAll(() => {
    httpServer.close()
    io.close()
    clientSocket1.close()
    clientSocket2.close()
    connectionManager.stopLobbyCheck()
  })

  test("join of a 2 players should start game", async () => {
    const nickname1 = "player1"
    const nickname2 = "player2"
    clientSocket1.emit(CLIENT_SIGNALS.join, { nickname: "player1" })
    clientSocket2.emit(CLIENT_SIGNALS.join, { nickname: "player2" })

    await waitFor(clientSocket1, SERVER_SIGNALS.startGame)
    await waitFor(clientSocket2, SERVER_SIGNALS.startGame)

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
  }, 10000)

  // test("moves", async () => {
  //   clientSocket1.emit(SIGNALS.move, { move: MOVES.UP })
  //   const x = await waitFor(clientSocket1, SIGNALS.stateUpdate)
  //   // clientSocket2.emit(SIGNALS.move, { move: MOVES.DOWN })
  // })

  //   clientSocket1.disconnect()
  //   clientSocket2.disconnect()
  // })
})
