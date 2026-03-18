import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDatabaseConfig } from "../src/config";
import { createPool } from "../src/db";

const { DATABASE_URL } = loadDatabaseConfig();
const pool = createPool(DATABASE_URL);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(currentDirectory, "../sql/migrations");

try {
  const files = (await readdir(migrationsDirectory)).filter((file) => file.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = await readFile(path.join(migrationsDirectory, file), "utf8");
    await pool.query(sql);
    console.log(`Applied migration ${file}`);
  }
} finally {
  await pool.end();
}
