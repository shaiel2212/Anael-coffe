#!/usr/bin/env node
/**
 * Runs the Sequelize seeder only if the cafes table is empty.
 * Prevents duplicate seeding on container restarts.
 */
const { execSync } = require('child_process');
const mysql = require('mysql2/promise');

async function seedIfEmpty() {
  const url = process.env.MYSQL_URL;
  if (!url) {
    console.log('[seed-if-empty] No MYSQL_URL — skipping seed');
    process.exit(0);
  }

  let conn;
  try {
    conn = await mysql.createConnection(url);
    const [[row]] = await conn.query('SELECT COUNT(*) as cnt FROM cafes');
    const count = row.cnt;

    if (count > 0) {
      console.log(`[seed-if-empty] ${count} cafe(s) already exist — skipping seed`);
    } else {
      console.log('[seed-if-empty] Database is empty — running seed...');
      execSync('npx sequelize-cli db:seed:all', {
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: 'production' },
      });
      console.log('[seed-if-empty] Seed completed.');
    }
  } catch (err) {
    console.error('[seed-if-empty] Error:', err.message);
    // Non-fatal - app can still start without seed data
  } finally {
    if (conn) await conn.end();
  }
  process.exit(0);
}

seedIfEmpty().catch((err) => {
  console.error('[seed-if-empty] Fatal:', err);
  process.exit(1);
});
