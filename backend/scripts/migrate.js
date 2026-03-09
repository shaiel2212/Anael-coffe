#!/usr/bin/env node
/**
 * הרצת מיגרציות עם NODE_ENV=production (לפרוד / Railway).
 * לא תלוי ב-cross-env.
 */
process.env.NODE_ENV = 'production';
const { execSync } = require('child_process');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

try {
  execSync('npx sequelize-cli db:migrate', {
    stdio: 'inherit',
    env: process.env,
    cwd: path.resolve(__dirname, '..'),
  });
  process.exit(0);
} catch (err) {
  console.error('[migrate] Failed:', err.message);
  process.exit(1);
}
