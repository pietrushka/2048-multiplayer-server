const config = {
  NODE_ENV: process.env.NODE_ENV as string,
  NODE_LOCAL_PORT: process.env.NODE_LOCAL_PORT as string,
  NODE_DOCKER_PORT: process.env.NODE_DOCKER_PORT as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  ADMIN_SECRET_PASSWORD: process.env.ADMIN_SECRET_PASSWORD as string,
  POSTGRESDB_CONNECTION_URL: process.env.POSTGRESDB_CONNECTION_URL as string,
  RESEND_API_KEY: process.env.RESEND_API_KEY as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  SERVER_URL: process.env.SERVER_URL as string,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
}

export const corsOptions = {
  origin: ["http://localhost:3000", "https://2048vs.com"],
  credentials: true,
  exposedHeaders: [
    "set-cookie",
    "Content-Type",
    "Authorization",
    "Cookie",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
  ],
}

export default config
