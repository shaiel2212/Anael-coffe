const bcrypt = require('bcryptjs');
const { sequelize, Cafe, User, Category, Product } = require('../models');
const logger = require('./logger');

const seed = async () => {
  try {
    await sequelize.sync({ alter: true });
    logger.info('Database synced');

    const [cafe] = await Cafe.findOrCreate({
      where: { slug: 'my-cafe' },
      defaults: {
        name: 'בית קפה שלי',
        slug: 'my-cafe',
        primary_color: '#6F4E37',
        default_language: 'he',
        address: 'רחוב הדוגמה 1, תל אביב',
        phone: '03-1234567',
      },
    });
    logger.info(`Cafe: ${cafe.name}`);

    const passwordHash = await bcrypt.hash('admin123', 10);
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@mycafe.com' },
      defaults: {
        cafe_id: cafe.id,
        name: 'מנהל ראשי',
        email: 'admin@mycafe.com',
        password_hash: passwordHash,
        role: 'admin',
      },
    });
    logger.info(`Admin user: ${admin.email}`);

    const [hotCategory] = await Category.findOrCreate({
      where: { cafe_id: cafe.id, name_he: 'משקאות חמים' },
      defaults: {
        cafe_id: cafe.id,
        name_he: 'משקאות חמים',
        name_en: 'Hot Drinks',
        name_ru: 'Горячие напитки',
        display_order: 1,
      },
    });

    const [coldCategory] = await Category.findOrCreate({
      where: { cafe_id: cafe.id, name_he: 'משקאות קרים' },
      defaults: {
        cafe_id: cafe.id,
        name_he: 'משקאות קרים',
        name_en: 'Cold Drinks',
        name_ru: 'Холодные напитки',
        display_order: 2,
      },
    });

    const [foodCategory] = await Category.findOrCreate({
      where: { cafe_id: cafe.id, name_he: 'מאפים' },
      defaults: {
        cafe_id: cafe.id,
        name_he: 'מאפים',
        name_en: 'Pastries',
        name_ru: 'Выпечка',
        display_order: 3,
      },
    });

    const products = [
      { category_id: hotCategory.id, name_he: 'אספרסו', name_en: 'Espresso', name_ru: 'Эспрессо', price: 9.00, display_order: 1 },
      { category_id: hotCategory.id, name_he: 'קפה אמריקן', name_en: 'Americano', name_ru: 'Американо', price: 11.00, display_order: 2 },
      { category_id: hotCategory.id, name_he: 'קפוצ\'ינו', name_en: 'Cappuccino', name_ru: 'Капучино', price: 14.00, allergens: ['dairy'], display_order: 3 },
      { category_id: hotCategory.id, name_he: 'לאטה', name_en: 'Latte', name_ru: 'Латте', price: 15.00, allergens: ['dairy'], display_order: 4 },
      { category_id: coldCategory.id, name_he: 'קפה קר', name_en: 'Iced Coffee', name_ru: 'Холодный кофе', price: 16.00, allergens: ['dairy'], display_order: 1 },
      { category_id: coldCategory.id, name_he: 'לימונדה', name_en: 'Lemonade', name_ru: 'Лимонад', price: 14.00, display_order: 2 },
      { category_id: foodCategory.id, name_he: 'קרואסון חמאה', name_en: 'Butter Croissant', name_ru: 'Круассан с маслом', price: 12.00, allergens: ['gluten', 'dairy'], display_order: 1 },
      { category_id: foodCategory.id, name_he: 'עוגיית שוקולד', name_en: 'Chocolate Cookie', name_ru: 'Шоколадное печенье', price: 8.00, allergens: ['gluten', 'eggs'], display_order: 2 },
    ];

    for (const p of products) {
      await Product.findOrCreate({ where: { category_id: p.category_id, name_he: p.name_he }, defaults: p });
    }

    logger.info('Seed completed successfully');
    logger.info('Login: admin@mycafe.com / admin123');
  } catch (err) {
    logger.error('Seed failed', err);
    throw err;
  }
};

module.exports = seed;
