import { Client } from "pg";
import { loadDatabaseConfig } from "../src/config";

const { DATABASE_URL } = loadDatabaseConfig();
const databaseUrl = new URL(DATABASE_URL);
const databaseName = databaseUrl.pathname.replace(/^\//, "");

if (!/^[a-zA-Z0-9_]+$/.test(databaseName)) {
  throw new Error(`Unsupported database name: ${databaseName}`);
}

databaseUrl.pathname = "/postgres";

const client = new Client({ connectionString: databaseUrl.toString() });

try {
  await client.connect();
  const existingDatabase = await client.query("select 1 from pg_database where datname = $1", [databaseName]);

  if (existingDatabase.rowCount) {
    console.log(`Database ${databaseName} already exists.`);
  } else {
    await client.query(`create database ${databaseName}`);
    console.log(`Database ${databaseName} created.`);
  }
} finally {
  await client.end();
}
