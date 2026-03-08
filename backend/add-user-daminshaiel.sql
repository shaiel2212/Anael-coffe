-- הוספת משתמש: daminshaiel / סיסמה: Aa123456
-- הרץ ב-MySQL Workbench על המסד anael_coffe_db (או הרץ: mysql -u root -p anael_coffe_db < add-user-daminshaiel.sql)

USE anael_coffe_db;

INSERT INTO users (id, cafe_id, name, email, password_hash, role, is_active, created_at, updated_at)
SELECT
  UUID(),
  c.id,
  'daminshaiel',
  'daminshaiel@coffe.com',
  '$2a$10$0e5qghKtjZ.C6J4VSzFlcuE.TJ8eVy4haOqdKULv7Lq/YakxuPEOW',
  'admin',
  1,
  NOW(),
  NOW()
FROM cafes c
WHERE (c.deleted_at IS NULL)
LIMIT 1;

SELECT 'User added. Login: daminshaiel@coffe.com / Aa123456' AS message;
