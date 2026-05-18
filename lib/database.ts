import { Pool } from 'pg';
import type { DB } from './types';
import { initialDB } from './store';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DATABASE_URL environment variable. Add it to .env.local.');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const TABLE_NAME = 'school_store';
const KEY = 'default';

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
      key TEXT PRIMARY KEY,
      payload JSONB NOT NULL
    )
  `);
}

export async function getDB(): Promise<DB> {
  await initDB();
  const result = await pool.query('SELECT payload FROM school_store WHERE key = $1', [KEY]);
  if (result.rowCount === 0) {
    await saveDB(initialDB);
    return initialDB;
  }
  return result.rows[0].payload as DB;
}

export async function saveDB(db: DB): Promise<void> {
  await initDB();
  await pool.query(
    `INSERT INTO ${TABLE_NAME}(key,payload) VALUES ($1,$2)
     ON CONFLICT(key) DO UPDATE SET payload = excluded.payload`,
    [KEY, db]
  );
}
