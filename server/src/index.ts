import { createApp } from "./app";
import { loadServerConfig } from "./config";
import { createPool } from "./db";
import { createPostgresRepository } from "./postgresRepository";

const config = loadServerConfig();
const pool = createPool(config.DATABASE_URL);
const repository = createPostgresRepository(pool);
const isProduction = process.env.NODE_ENV === "production";
const app = createApp({
  repository,
  sessionSecret: config.SESSION_SECRET,
  secureCookie: config.COOKIE_SECURE ?? isProduction,
});

const host = isProduction ? "0.0.0.0" : undefined;

function startServer() {
  if (host) {
    return app.listen(config.API_PORT, host, () => {
      console.log(`API listening on http://${host}:${config.API_PORT}`);
    });
  }
  return app.listen(config.API_PORT, () => {
    console.log(`API listening on http://127.0.0.1:${config.API_PORT}`);
  });
}

const server = startServer();

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
