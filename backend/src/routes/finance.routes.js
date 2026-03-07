const router = require('express').Router();
const { getRecords, createRecord, updateRecord, deleteRecord, getSummary } = require('../controllers/finance.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, getRecords);
router.post('/', authenticate, createRecord);
router.put('/:id', authenticate, updateRecord);
router.delete('/:id', authenticate, authorize('admin', 'manager'), deleteRecord);
router.get('/summary', authenticate, authorize('admin', 'manager'), getSummary);

module.exports = router;
