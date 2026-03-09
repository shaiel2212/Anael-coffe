#!/usr/bin/env node
/**
 * בודק שהבקאנד בפרוד עובד: health + login
 * שימוש:
 *   node scripts/check-prod.js
 *   node scripts/check-prod.js https://your-backend.railway.app
 *   API_URL=https://your-backend.railway.app node scripts/check-prod.js
 */
const https = require('https');
const http = require('http');

const BASE = process.env.API_URL || process.argv[2] || 'http://localhost:5000';
const baseUrl = BASE.replace(/\/$/, '');
const api = `${baseUrl}/api/v1`;

function request(method, path, body = null) {
  const url = new URL(path.startsWith('http') ? path : api + path);
  const isHttps = url.protocol === 'https:';
  const lib = isHttps ? https : http;
  return new Promise((resolve, reject) => {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const req = lib.request(url, opts, (res) => {
      let data = '';
      res.on('data', (ch) => (data += ch));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: data ? JSON.parse(data) : null });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  console.log('Checking:', api);
  let ok = true;

  const health = await request('GET', '/health').catch((e) => ({ status: 0, data: e.message }));
  if (health.status === 200) {
    console.log('  [OK] GET /api/v1/health');
  } else {
    console.log('  [FAIL] GET /api/v1/health', health.status || health.data);
    ok = false;
  }

  const login = await request('POST', '/auth/login', {
    email: 'admin@mycafe.com',
    password: 'admin123',
  }).catch((e) => ({ status: 0, data: e.message }));

  if (login.status === 200 && login.data?.accessToken) {
    console.log('  [OK] POST /api/v1/auth/login (admin@mycafe.com)');
  } else if (login.status === 401) {
    console.log('  [WARN] Login 401 – user not found or wrong password (run seed on prod DB?)');
  } else {
    console.log('  [FAIL] POST /api/v1/auth/login', login.status || login.data);
    ok = false;
  }

  if (ok) {
    console.log('\nProd check passed.');
    process.exit(0);
  } else {
    console.log('\nProd check had failures.');
    process.exit(1);
  }
}

main();
