'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface) {
    const cafeId = uuidv4();
    const adminId = uuidv4();
    const cat1Id = uuidv4();
    const cat2Id = uuidv4();
    const cat3Id = uuidv4();
    const now = new Date();

    await queryInterface.bulkInsert('cafes', [{
      id: cafeId,
      name: 'בית קפה שלי',
      slug: 'my-cafe',
      primary_color: '#6F4E37',
      default_language: 'he',
      address: 'רחוב הדוגמה 1, תל אביב',
      phone: '03-1234567',
      is_active: true,
      created_at: now,
      updated_at: now,
    }]);

    const passwordHash = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('users', [{
      id: adminId,
      cafe_id: cafeId,
      name: 'מנהל ראשי',
      email: 'admin@mycafe.com',
      password_hash: passwordHash,
      role: 'admin',
      is_active: true,
      created_at: now,
      updated_at: now,
    }]);

    await queryInterface.bulkInsert('categories', [
      { id: cat1Id, cafe_id: cafeId, name_he: 'משקאות חמים', name_en: 'Hot Drinks', name_ru: 'Горячие напитки', display_order: 1, is_visible: true, created_at: now, updated_at: now },
      { id: cat2Id, cafe_id: cafeId, name_he: 'משקאות קרים', name_en: 'Cold Drinks', name_ru: 'Холодные напитки', display_order: 2, is_visible: true, created_at: now, updated_at: now },
      { id: cat3Id, cafe_id: cafeId, name_he: 'מאפים', name_en: 'Pastries', name_ru: 'Выпечка', display_order: 3, is_visible: true, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('products', [
      { id: uuidv4(), category_id: cat1Id, name_he: 'אספרסו', name_en: 'Espresso', name_ru: 'Эспрессо', price: 9.00, allergens: '[]', is_available: true, is_visible: true, display_order: 1, created_at: now, updated_at: now },
      { id: uuidv4(), category_id: cat1Id, name_he: 'קפה אמריקן', name_en: 'Americano', name_ru: 'Американо', price: 11.00, allergens: '[]', is_available: true, is_visible: true, display_order: 2, created_at: now, updated_at: now },
      { id: uuidv4(), category_id: cat1Id, name_he: "קפוצ'ינו", name_en: 'Cappuccino', name_ru: 'Капучино', price: 14.00, allergens: '["dairy"]', is_available: true, is_visible: true, display_order: 3, created_at: now, updated_at: now },
      { id: uuidv4(), category_id: cat1Id, name_he: 'לאטה', name_en: 'Latte', name_ru: 'Латте', price: 15.00, allergens: '["dairy"]', is_available: true, is_visible: true, display_order: 4, created_at: now, updated_at: now },
      { id: uuidv4(), category_id: cat2Id, name_he: 'קפה קר', name_en: 'Iced Coffee', name_ru: 'Холодный кофе', price: 16.00, allergens: '["dairy"]', is_available: true, is_visible: true, display_order: 1, created_at: now, updated_at: now },
      { id: uuidv4(), category_id: cat2Id, name_he: 'לימונדה', name_en: 'Lemonade', name_ru: 'Лимонад', price: 14.00, allergens: '[]', is_available: true, is_visible: true, display_order: 2, created_at: now, updated_at: now },
      { id: uuidv4(), category_id: cat3Id, name_he: 'קרואסון חמאה', name_en: 'Butter Croissant', name_ru: 'Круассан с маслом', price: 12.00, allergens: '["gluten","dairy"]', is_available: true, is_visible: true, display_order: 1, created_at: now, updated_at: now },
      { id: uuidv4(), category_id: cat3Id, name_he: 'עוגיית שוקולד', name_en: 'Chocolate Cookie', name_ru: 'Шоколадное печенье', price: 8.00, allergens: '["gluten","eggs"]', is_available: true, is_visible: true, display_order: 2, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('inventory_items', [
      { id: uuidv4(), cafe_id: cafeId, name: 'פולי קפה', unit: 'ק"ג', current_quantity: 5.500, minimum_quantity: 2.000, cost_per_unit: 80.00, supplier: 'קפה פרמיום בע"מ', created_at: now, updated_at: now },
      { id: uuidv4(), cafe_id: cafeId, name: 'חלב', unit: 'ליטר', current_quantity: 10.000, minimum_quantity: 5.000, cost_per_unit: 6.50, supplier: 'תנובה', created_at: now, updated_at: now },
      { id: uuidv4(), cafe_id: cafeId, name: 'סוכר', unit: 'ק"ג', current_quantity: 8.000, minimum_quantity: 3.000, cost_per_unit: 5.00, created_at: now, updated_at: now },
      { id: uuidv4(), cafe_id: cafeId, name: 'כוסות חד פעמי', unit: 'יחידות', current_quantity: 200, minimum_quantity: 50, cost_per_unit: 0.80, created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('inventory_items', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('cafes', null, {});
  },
};
