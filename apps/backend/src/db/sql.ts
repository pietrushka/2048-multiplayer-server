import dotenv from "dotenv"
import postgres from "postgres"

dotenv.config()

const sql = postgres(process.env.POSTGRESDB_CONNECTION_URL as string)

export default sql
