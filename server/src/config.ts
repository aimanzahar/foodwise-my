import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv({ path: ".env.server.local", override: false });
loadEnv({ path: ".env.server", override: false });

const databaseConfigSchema = z.object({
  DATABASE_URL: z.string().min(1),
});

const serverConfigSchema = databaseConfigSchema.extend({
  SESSION_SECRET: z.string().min(16),
  API_PORT: z.coerce.number().int().positive().default(3001),
  APP_ORIGIN: z.string().url().optional(),
  COOKIE_SECURE: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v === "true"),
});

export function loadDatabaseConfig() {
  return databaseConfigSchema.parse(process.env);
}

export function loadServerConfig() {
  return serverConfigSchema.parse(process.env);
}
