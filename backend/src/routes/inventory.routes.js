const router = require('express').Router();
const { getItems, createItem, updateItem, deleteItem, addTransaction, getTransactions } = require('../controllers/inventory.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, getItems);
router.post('/', authenticate, authorize('admin', 'manager'), createItem);
router.put('/:id', authenticate, authorize('admin', 'manager'), updateItem);
router.delete('/:id', authenticate, authorize('admin'), deleteItem);
router.post('/:id/transactions', authenticate, addTransaction);
router.get('/:id/transactions', authenticate, getTransactions);

module.exports = router;
