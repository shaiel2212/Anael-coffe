#!/usr/bin/env node
/**
 * Drops all tables and resets SequelizeMeta so migrations run clean.
 * Used as a pre-migration step on Railway to recover from broken DB state.
 */
const mysql = require('mysql2/promise');

async function resetDb() {
  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (!url) {
    console.error('No MYSQL_URL set, skipping reset');
    process.exit(0);
  }

  let conn;
  try {
    conn = await mysql.createConnection({
      uri: url,
      ssl: { rejectUnauthorized: false },
      multipleStatements: true,
    });

    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    const [rows] = await conn.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE()`
    );

    for (const row of rows) {
      const table = Object.values(row)[0];
      console.log(`Dropping table: ${table}`);
      await conn.query(`DROP TABLE IF EXISTS \`${table}\``);
    }

    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database reset complete — all tables dropped.');
  } catch (err) {
    console.error('db-reset error:', err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

resetDb();
