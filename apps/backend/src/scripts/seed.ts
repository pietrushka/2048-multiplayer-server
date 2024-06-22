import sql from "../db/sql"
import { createTokensTable, createUsersTable } from "../db/createTables"
;(async () => {
  try {
    await sql`DROP TABLE IF EXISTS tokens;`
    await sql`DROP TABLE IF EXISTS users;`

    await createUsersTable()
    await createTokensTable()
  } catch (error) {
    console.error("Error during table creation:", error)
  } finally {
    await sql.end()
  }
})()
