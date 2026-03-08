-- ============================================================
-- Anael Coffee - התקנת מסד נתונים ל-MySQL Workbench
-- הרץ את כל הסקריפט (Execute → Execute All or Ctrl+Shift+Enter)
-- ============================================================

-- 1) יצירת המסד והמשתמש
-- -----------------------
CREATE DATABASE IF NOT EXISTS anael_coffe_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE anael_coffe_db;

-- משתמש לאפליקציה (אם תריץ עם Docker או תרצה משתמש נפרד)
DROP USER IF EXISTS 'cafe_user'@'localhost';
CREATE USER 'cafe_user'@'localhost' IDENTIFIED BY 'cafe_password';
GRANT ALL PRIVILEGES ON anael_coffe_db.* TO 'cafe_user'@'localhost';
FLUSH PRIVILEGES;

-- 2) מחיקת טבלאות אם קיימות (להרצה נקייה)
-- -----------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS financial_records;
DROP TABLE IF EXISTS work_hours;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS inventory_transactions;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS cafes;
SET FOREIGN_KEY_CHECKS = 1;

-- 3) טבלאות
-- ----------

CREATE TABLE cafes (
  id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#4A90E2',
  default_language ENUM('he', 'en', 'ru') DEFAULT 'he',
  address TEXT,
  phone VARCHAR(20),
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY cafes_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
  id CHAR(36) NOT NULL,
  cafe_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
  is_active TINYINT(1) DEFAULT 1,
  last_login_at DATETIME,
  refresh_token TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  UNIQUE KEY users_email (email),
  KEY users_cafe_id (cafe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  id CHAR(36) NOT NULL,
  cafe_id CHAR(36) NOT NULL,
  name_he VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ru VARCHAR(255),
  display_order INT DEFAULT 0,
  is_visible TINYINT(1) DEFAULT 1,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  KEY categories_cafe_id (cafe_id),
  KEY categories_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
  id CHAR(36) NOT NULL,
  category_id CHAR(36) NOT NULL,
  name_he VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  name_ru VARCHAR(255),
  description_he TEXT,
  description_en TEXT,
  description_ru TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  allergens JSON DEFAULT ('[]'),
  is_available TINYINT(1) DEFAULT 1,
  is_visible TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  KEY products_category_id (category_id),
  KEY products_display_order (display_order),
  KEY products_name_he (name_he)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_items (
  id CHAR(36) NOT NULL,
  cafe_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  current_quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
  minimum_quantity DECIMAL(10,3) NOT NULL DEFAULT 0,
  cost_per_unit DECIMAL(10,2),
  supplier VARCHAR(255),
  notes TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  KEY inventory_items_cafe_id (cafe_id),
  KEY inventory_items_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_transactions (
  id CHAR(36) NOT NULL,
  inventory_item_id CHAR(36) NOT NULL,
  user_id CHAR(36),
  type ENUM('in', 'out', 'adjustment') NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  quantity_before DECIMAL(10,3) NOT NULL,
  quantity_after DECIMAL(10,3) NOT NULL,
  notes TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY inventory_transactions_inventory_item_id (inventory_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employees (
  id CHAR(36) NOT NULL,
  cafe_id CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  role VARCHAR(100),
  hourly_rate DECIMAL(10,2),
  start_date DATE,
  is_active TINYINT(1) DEFAULT 1,
  notes TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  KEY employees_cafe_id (cafe_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE work_hours (
  id CHAR(36) NOT NULL,
  employee_id CHAR(36) NOT NULL,
  date DATE NOT NULL,
  clock_in TIME NOT NULL,
  clock_out TIME,
  hours_worked DECIMAL(5,2),
  notes TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY work_hours_employee_id (employee_id),
  KEY work_hours_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE financial_records (
  id CHAR(36) NOT NULL,
  cafe_id CHAR(36) NOT NULL,
  user_id CHAR(36),
  type ENUM('income', 'expense') NOT NULL,
  category VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME,
  PRIMARY KEY (id),
  KEY financial_records_cafe_id (cafe_id),
  KEY financial_records_date (date),
  KEY financial_records_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) נתוני התחלה (דמו + מנהל)
-- ----------------------------
-- סיסמת המנהל: admin123 (hash עם bcrypt)
SET @now = NOW();
SET @cafe_id = UUID();
SET @admin_id = UUID();
SET @cat1 = UUID(), @cat2 = UUID(), @cat3 = UUID();

INSERT INTO cafes (id, name, slug, primary_color, default_language, address, phone, is_active, created_at, updated_at) VALUES
(@cafe_id, 'בית קפה שלי', 'my-cafe', '#6F4E37', 'he', 'רחוב הדוגמה 1, תל אביב', '03-1234567', 1, @now, @now);

INSERT INTO users (id, cafe_id, name, email, password_hash, role, is_active, created_at, updated_at) VALUES
(@admin_id, @cafe_id, 'מנהל ראשי', 'admin@mycafe.com', '$2a$10$tauNZMh7daOZonx8ayfyMuoiZp/J0yV5NHM2IqFKHPQgfmd4Csth2', 'admin', 1, @now, @now);

INSERT INTO categories (id, cafe_id, name_he, name_en, name_ru, display_order, is_visible, created_at, updated_at) VALUES
(@cat1, @cafe_id, 'משקאות חמים', 'Hot Drinks', 'Горячие напитки', 1, 1, @now, @now),
(@cat2, @cafe_id, 'משקאות קרים', 'Cold Drinks', 'Холодные напитки', 2, 1, @now, @now),
(@cat3, @cafe_id, 'מאפים', 'Pastries', 'Выпечка', 3, 1, @now, @now);

INSERT INTO products (id, category_id, name_he, name_en, name_ru, price, allergens, is_available, is_visible, display_order, created_at, updated_at) VALUES
(UUID(), @cat1, 'אספרסו', 'Espresso', 'Эспрессо', 9.00, '[]', 1, 1, 1, @now, @now),
(UUID(), @cat1, 'קפה אמריקן', 'Americano', 'Американо', 11.00, '[]', 1, 1, 2, @now, @now),
(UUID(), @cat1, "קפוצ'ינו", 'Cappuccino', 'Капучино', 14.00, '["dairy"]', 1, 1, 3, @now, @now),
(UUID(), @cat1, 'לאטה', 'Latte', 'Латте', 15.00, '["dairy"]', 1, 1, 4, @now, @now),
(UUID(), @cat2, 'קפה קר', 'Iced Coffee', 'Холодный кофе', 16.00, '["dairy"]', 1, 1, 1, @now, @now),
(UUID(), @cat2, 'לימונדה', 'Lemonade', 'Лимонад', 14.00, '[]', 1, 1, 2, @now, @now),
(UUID(), @cat3, 'קרואסון חמאה', 'Butter Croissant', 'Круассан с маслом', 12.00, '["gluten","dairy"]', 1, 1, 1, @now, @now),
(UUID(), @cat3, 'עוגיית שוקולד', 'Chocolate Cookie', 'Шоколадное печенье', 8.00, '["gluten","eggs"]', 1, 1, 2, @now, @now);

INSERT INTO inventory_items (id, cafe_id, name, unit, current_quantity, minimum_quantity, cost_per_unit, supplier, created_at, updated_at) VALUES
(UUID(), @cafe_id, 'פולי קפה', 'ק"ג', 5.500, 2.000, 80.00, 'קפה פרמיום בע"מ', @now, @now),
(UUID(), @cafe_id, 'חלב', 'ליטר', 10.000, 5.000, 6.50, 'תנובה', @now, @now),
(UUID(), @cafe_id, 'סוכר', 'ק"ג', 8.000, 3.000, 5.00, NULL, @now, @now),
(UUID(), @cafe_id, 'כוסות חד פעמי', 'יחידות', 200, 50, 0.80, NULL, @now, @now);

-- ============================================================
-- סיום
-- ============================================================
-- פרטי כניסה: admin@mycafe.com / admin123
-- כדי להשתמש ב-cafe_user: ב-.env הגדר DB_USER=cafe_user, DB_PASSWORD=cafe_password
SELECT 'Setup completed. Login: admin@mycafe.com / admin123' AS message;
