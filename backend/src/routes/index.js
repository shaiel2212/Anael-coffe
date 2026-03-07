const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/menu', require('./menu.routes'));
router.use('/inventory', require('./inventory.routes'));
router.use('/employees', require('./employee.routes'));
router.use('/finance', require('./finance.routes'));

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
