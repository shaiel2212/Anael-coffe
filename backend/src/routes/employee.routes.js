const router = require('express').Router();
const { getEmployees, createEmployee, updateEmployee, deleteEmployee, getWorkHours, addWorkHour, getSalarySummary } = require('../controllers/employee.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, getEmployees);
router.post('/', authenticate, authorize('admin', 'manager'), createEmployee);
router.put('/:id', authenticate, authorize('admin', 'manager'), updateEmployee);
router.delete('/:id', authenticate, authorize('admin'), deleteEmployee);

router.get('/work-hours', authenticate, getWorkHours);
router.post('/work-hours', authenticate, addWorkHour);
router.get('/salary-summary', authenticate, authorize('admin', 'manager'), getSalarySummary);

module.exports = router;
