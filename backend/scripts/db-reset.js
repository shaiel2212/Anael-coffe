#!/usr/bin/env node
/**
 * Drops all user tables and clears SequelizeMeta so migrations start fresh.
 * Runs before migrations on Railway to recover from a broken migration state.
 */
const mysql = require('mysql2/promise');

async function resetDb() {
  const url = process.env.MYSQL_URL;
  if (!url) {
    console.log('[db-reset] No MYSQL_URL — skipping reset');
    process.exit(0);
  }

  console.log('[db-reset] Connecting to MySQL...');

  // mysql2 accepts a plain connection-string directly
  let conn;
  try {
    conn = await mysql.createConnection(url);
    console.log('[db-reset] Connected.');
  } catch (err) {
    console.error('[db-reset] Connection error:', err.message);
    // Non-fatal — let migration attempt run
    process.exit(0);
  }

  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    const [rows] = await conn.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`
    );

    if (rows.length === 0) {
      console.log('[db-reset] Database is empty — nothing to drop.');
    } else {
      for (const row of rows) {
        const table = Object.values(row)[0];
        console.log(`[db-reset] Dropping table: ${table}`);
        await conn.query(`DROP TABLE IF EXISTS \`${table}\``);
      }
      console.log('[db-reset] All tables dropped successfully.');
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
  } catch (err) {
    console.error('[db-reset] Error while resetting:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

resetDb();
