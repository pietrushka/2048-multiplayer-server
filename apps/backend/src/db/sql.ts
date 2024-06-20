import dotenv from "dotenv"
import postgres from "postgres"
dotenv.config()

const dbConnectionUrl = `postgresql://${process.env.POSTGRESDB_USER}:${process.env.POSTGRESDB_ROOT_PASSWORD}@localhost:${process.env.POSTGRESDB_LOCAL_PORT}/${process.env.POSTGRESDB_DATABASE}`

const sql = postgres(dbConnectionUrl)

export default sql
