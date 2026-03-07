const { Category, Product, Cafe } = require('../models');
const { Op } = require('sequelize');
const QRCode = require('qrcode');

const getMenu = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const cafe = await Cafe.findOne({ where: { slug, is_active: true } });

    if (!cafe) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Cafe not found' });
    }

    const categories = await Category.findAll({
      where: { cafe_id: cafe.id, is_visible: true },
      include: [{
        model: Product,
        as: 'products',
        where: { is_visible: true },
        required: false,
        order: [['display_order', 'ASC']],
      }],
      order: [['display_order', 'ASC']],
    });

    res.json({
      cafe: {
        id: cafe.id,
        name: cafe.name,
        logo_url: cafe.logo_url,
        primary_color: cafe.primary_color,
        default_language: cafe.default_language,
      },
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const generateQR = async (req, res, next) => {
  try {
    const cafe = await Cafe.findByPk(req.cafeId);
    if (!cafe) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Cafe not found' });
    }

    const menuUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/menu/${cafe.slug}`;
    const qrOptions = {
      width: 400,
      margin: 2,
      color: {
        dark: cafe.primary_color || '#000000',
        light: '#ffffff',
      },
    };

    const qrDataUrl = await QRCode.toDataURL(menuUrl, qrOptions);
    res.json({ qr_code: qrDataUrl, menu_url: menuUrl });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { cafe_id: req.cafeId },
      order: [['display_order', 'ASC']],
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name_he, name_en, name_ru, display_order, is_visible } = req.body;
    if (!name_he) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'Hebrew name is required' });
    }

    const category = await Category.create({
      cafe_id: req.cafeId,
      name_he,
      name_en,
      name_ru,
      display_order: display_order || 0,
      is_visible: is_visible !== undefined ? is_visible : true,
    });

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!category) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Category not found' });
    }
    await category.update(req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!category) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Category not found' });
    }
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { category_id, search } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name_he: { [Op.like]: `%${search}%` } },
        { name_en: { [Op.like]: `%${search}%` } },
      ];
    }

    const include = [{
      model: Category,
      as: 'category',
      where: { cafe_id: req.cafeId },
      required: true,
    }];
    if (category_id) {
      include[0].where.id = category_id;
    }

    const products = await Product.findAll({
      where,
      include,
      order: [['display_order', 'ASC']],
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { category_id, name_he, name_en, name_ru, description_he, description_en, description_ru,
      price, allergens, is_available, is_visible, display_order } = req.body;

    if (!category_id || !name_he || price === undefined) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'category_id, name_he, and price are required' });
    }

    const category = await Category.findOne({ where: { id: category_id, cafe_id: req.cafeId } });
    if (!category) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Category not found' });
    }

    const product = await Product.create({
      category_id, name_he, name_en, name_ru,
      description_he, description_en, description_ru,
      price, allergens: allergens || [],
      is_available: is_available !== undefined ? is_available : true,
      is_visible: is_visible !== undefined ? is_visible : true,
      display_order: display_order || 0,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: [{ model: Category, as: 'category', where: { cafe_id: req.cafeId } }],
    });
    if (!product) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Product not found' });
    }
    await product.update(req.body);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
      include: [{ model: Category, as: 'category', where: { cafe_id: req.cafeId } }],
    });
    if (!product) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted (soft) successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMenu, generateQR,
  getCategories, createCategory, updateCategory, deleteCategory,
  getProducts, createProduct, updateProduct, deleteProduct,
};
