import sql from "./sql"

export async function createUsersTable() {
  await sql`
    CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    nickname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    best_score INT NOT NULL,
    is_active BOOLEAN NOT NULL
    );`
}

export async function createTokensTable() {
  await sql`
      CREATE TABLE tokens (
      token VARCHAR(255) PRIMARY KEY,
      user_id UUID NOT NULL,
      type VARCHAR(50) NOT NULL,
      expire_at TIMESTAMP NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`
}
