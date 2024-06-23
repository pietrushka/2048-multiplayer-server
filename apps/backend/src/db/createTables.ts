import sql from "./sql"

export async function createUsersTable() {
  await sql`
    CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    nickname TEXT NOT NULL,
    password TEXT NOT NULL,
    best_score INT NOT NULL,
    is_active BOOLEAN NOT NULL
    );`
}

export async function createTokensTable() {
  await sql`
      CREATE TABLE tokens (
      token TEXT PRIMARY KEY,
      user_id UUID NOT NULL,
      type VARCHAR(50) NOT NULL,
      expire_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`
}
