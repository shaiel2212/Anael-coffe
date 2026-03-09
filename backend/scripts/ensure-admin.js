#!/usr/bin/env node
/**
 * Ensures the default admin user exists in the database.
 * Runs after migrations and seed-if-empty on every deploy.
 * Safe to run multiple times – only creates if missing.
 */
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function ensureAdmin() {
  const url = process.env.MYSQL_URL;
  if (!url) {
    console.log('[ensure-admin] No MYSQL_URL — skipping');
    process.exit(0);
  }

  let conn;
  try {
    conn = await mysql.createConnection(url);

    const [[existing]] = await conn.query(
      "SELECT id FROM users WHERE email = 'admin@mycafe.com' LIMIT 1"
    );

    if (existing) {
      console.log('[ensure-admin] Admin user already exists — OK');
      process.exit(0);
    }

    const [[cafe]] = await conn.query('SELECT id FROM cafes LIMIT 1');
    if (!cafe) {
      console.log('[ensure-admin] No cafe found — cannot create admin (seed may not have run yet)');
      process.exit(0);
    }

    const passwordHash = bcrypt.hashSync('admin123', 10);
    const now = new Date();
    await conn.query(
      `INSERT INTO users (id, cafe_id, name, email, password_hash, role, is_active, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), cafe.id, 'מנהל ראשי', 'admin@mycafe.com', passwordHash, 'admin', true, now, now]
    );

    console.log('[ensure-admin] Admin user created: admin@mycafe.com / admin123');
  } catch (err) {
    console.error('[ensure-admin] Error:', err.message);
    // Non-fatal — app can still start
  } finally {
    if (conn) await conn.end();
  }
  process.exit(0);
}

ensureAdmin().catch((err) => {
  console.error('[ensure-admin] Fatal:', err);
  process.exit(1);
});
