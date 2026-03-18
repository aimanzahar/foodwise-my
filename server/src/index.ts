import { createApp } from "./app";
import { loadServerConfig } from "./config";
import { createPool } from "./db";
import { createPostgresRepository } from "./postgresRepository";

const config = loadServerConfig();
const pool = createPool(config.DATABASE_URL);
const repository = createPostgresRepository(pool);
const app = createApp({
  repository,
  sessionSecret: config.SESSION_SECRET,
  isProduction: process.env.NODE_ENV === "production",
});

const server = app.listen(config.API_PORT, () => {
  console.log(`API listening on http://127.0.0.1:${config.API_PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
