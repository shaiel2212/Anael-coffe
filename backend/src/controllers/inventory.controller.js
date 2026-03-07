const { InventoryItem, InventoryTransaction, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getItems = async (req, res, next) => {
  try {
    const { search, low_stock } = req.query;
    const where = { cafe_id: req.cafeId };
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    if (low_stock === 'true') {
      where[Op.and] = sequelize.literal('current_quantity <= minimum_quantity');
    }

    const items = await InventoryItem.findAll({ where, order: [['name', 'ASC']] });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

const createItem = async (req, res, next) => {
  try {
    const { name, unit, current_quantity, minimum_quantity, cost_per_unit, supplier, notes } = req.body;
    if (!name || !unit) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'name and unit are required' });
    }

    const item = await InventoryItem.create({
      cafe_id: req.cafeId,
      name, unit,
      current_quantity: current_quantity || 0,
      minimum_quantity: minimum_quantity || 0,
      cost_per_unit, supplier, notes,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!item) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Inventory item not found' });
    }
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await InventoryItem.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!item) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Inventory item not found' });
    }
    await item.destroy();
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const addTransaction = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { type, quantity, notes } = req.body;
    if (!type || quantity === undefined) {
      await t.rollback();
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'type and quantity are required' });
    }

    const item = await InventoryItem.findOne({
      where: { id: req.params.id, cafe_id: req.cafeId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!item) {
      await t.rollback();
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Inventory item not found' });
    }

    const quantityBefore = parseFloat(item.current_quantity);
    let quantityAfter;

    if (type === 'in') {
      quantityAfter = quantityBefore + parseFloat(quantity);
    } else if (type === 'out') {
      quantityAfter = quantityBefore - parseFloat(quantity);
      if (quantityAfter < 0) {
        await t.rollback();
        return res.status(400).json({ error: 'ERR_VALIDATION', message: 'Insufficient stock' });
      }
    } else {
      quantityAfter = parseFloat(quantity);
    }

    const transaction = await InventoryTransaction.create({
      inventory_item_id: item.id,
      user_id: req.user.id,
      type,
      quantity: parseFloat(quantity),
      quantity_before: quantityBefore,
      quantity_after: quantityAfter,
      notes,
    }, { transaction: t });

    await item.update({ current_quantity: quantityAfter }, { transaction: t });
    await t.commit();

    const isLowStock = quantityAfter <= parseFloat(item.minimum_quantity);
    res.status(201).json({ transaction, item: { ...item.toJSON(), current_quantity: quantityAfter }, isLowStock });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await InventoryTransaction.findAll({
      where: { inventory_item_id: req.params.id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
      limit: 50,
    });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

module.exports = { getItems, createItem, updateItem, deleteItem, addTransaction, getTransactions };
