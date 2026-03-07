const { FinancialRecord, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getRecords = async (req, res, next) => {
  try {
    const { from, to, type, category, page = 1, limit = 20 } = req.query;
    const where = { cafe_id: req.cafeId };
    if (type) where.type = type;
    if (category) where.category = { [Op.like]: `%${category}%` };
    if (from && to) where.date = { [Op.between]: [from, to] };

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await FinancialRecord.findAndCountAll({
      where,
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    res.json({ total: count, page: parseInt(page), records: rows });
  } catch (err) {
    next(err);
  }
};

const createRecord = async (req, res, next) => {
  try {
    const { type, category, amount, description, date } = req.body;
    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'type, amount, and date are required' });
    }

    const record = await FinancialRecord.create({
      cafe_id: req.cafeId,
      user_id: req.user.id,
      type, category, amount, description, date,
    });

    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!record) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Record not found' });
    }
    await record.update(req.body);
    res.json(record);
  } catch (err) {
    next(err);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const record = await FinancialRecord.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!record) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Record not found' });
    }
    await record.destroy();
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'from and to dates are required' });
    }

    const dateWhere = { cafe_id: req.cafeId, date: { [Op.between]: [from, to] } };

    const [incomeResult, expenseResult] = await Promise.all([
      FinancialRecord.findOne({
        where: { ...dateWhere, type: 'income' },
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
        raw: true,
      }),
      FinancialRecord.findOne({
        where: { ...dateWhere, type: 'expense' },
        attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
        raw: true,
      }),
    ]);

    const totalIncome = parseFloat(incomeResult?.total || 0);
    const totalExpense = parseFloat(expenseResult?.total || 0);

    res.json({
      from, to,
      total_income: totalIncome,
      total_expense: totalExpense,
      net_profit: totalIncome - totalExpense,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecords, createRecord, updateRecord, deleteRecord, getSummary };
