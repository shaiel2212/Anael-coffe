const { Employee, WorkHour } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const getEmployees = async (req, res, next) => {
  try {
    const where = { cafe_id: req.cafeId };
    if (req.query.active !== undefined) {
      where.is_active = req.query.active === 'true';
    }
    const employees = await Employee.findAll({ where, order: [['name', 'ASC']] });
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { name, phone, email, role, hourly_rate, start_date, notes } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'name is required' });
    }
    const employee = await Employee.create({
      cafe_id: req.cafeId,
      name, phone, email, role, hourly_rate, start_date, notes,
    });
    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!employee) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Employee not found' });
    }
    await employee.update(req.body);
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ where: { id: req.params.id, cafe_id: req.cafeId } });
    if (!employee) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Employee not found' });
    }
    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};

const getWorkHours = async (req, res, next) => {
  try {
    const { from, to, employee_id } = req.query;
    const where = {};
    if (employee_id) where.employee_id = employee_id;
    if (from && to) where.date = { [Op.between]: [from, to] };

    const workHours = await WorkHour.findAll({
      where,
      include: [{
        model: Employee,
        as: 'employee',
        where: { cafe_id: req.cafeId },
        attributes: ['id', 'name', 'hourly_rate'],
      }],
      order: [['date', 'DESC'], ['clock_in', 'DESC']],
    });

    res.json(workHours);
  } catch (err) {
    next(err);
  }
};

const addWorkHour = async (req, res, next) => {
  try {
    const { employee_id, date, clock_in, clock_out, notes } = req.body;
    if (!employee_id || !date || !clock_in) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'employee_id, date, and clock_in are required' });
    }

    const employee = await Employee.findOne({ where: { id: employee_id, cafe_id: req.cafeId } });
    if (!employee) {
      return res.status(404).json({ error: 'ERR_NOT_FOUND', message: 'Employee not found' });
    }

    let hours_worked = null;
    if (clock_out) {
      const [inH, inM] = clock_in.split(':').map(Number);
      const [outH, outM] = clock_out.split(':').map(Number);
      hours_worked = ((outH * 60 + outM) - (inH * 60 + inM)) / 60;
    }

    const workHour = await WorkHour.create({ employee_id, date, clock_in, clock_out, hours_worked, notes });
    res.status(201).json(workHour);
  } catch (err) {
    next(err);
  }
};

const getSalarySummary = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: 'ERR_VALIDATION', message: 'from and to dates are required' });
    }

    const employees = await Employee.findAll({ where: { cafe_id: req.cafeId, is_active: true } });

    const summary = await Promise.all(employees.map(async (emp) => {
      const hours = await WorkHour.findAll({
        where: { employee_id: emp.id, date: { [Op.between]: [from, to] } },
      });

      const totalHours = hours.reduce((sum, h) => sum + parseFloat(h.hours_worked || 0), 0);
      const totalSalary = totalHours * parseFloat(emp.hourly_rate || 0);

      return {
        employee: { id: emp.id, name: emp.name, hourly_rate: emp.hourly_rate },
        total_hours: Math.round(totalHours * 100) / 100,
        total_salary: Math.round(totalSalary * 100) / 100,
        work_days: hours.length,
      };
    }));

    res.json(summary);
  } catch (err) {
    next(err);
  }
};

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee, getWorkHours, addWorkHour, getSalarySummary };
