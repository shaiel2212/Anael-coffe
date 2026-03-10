const router = require('express').Router();
const {
  getMenu, generateQR,
  getCategories, createCategory, updateCategory, deleteCategory,
  getProducts, createProduct, updateProduct, deleteProduct,
  uploadProductImage,
} = require('../controllers/menu.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { menuLimiter } = require('../middleware/rateLimiter.middleware');
const { uploadProductImage: productImageUpload } = require('../middleware/upload.middleware');

// Public - digital menu
router.get('/public/:slug', menuLimiter, getMenu);

// Protected - management
router.get('/qr', authenticate, authorize('admin', 'manager'), generateQR);

router.get('/categories', authenticate, getCategories);
router.post('/categories', authenticate, authorize('admin', 'manager'), createCategory);
router.put('/categories/:id', authenticate, authorize('admin', 'manager'), updateCategory);
router.delete('/categories/:id', authenticate, authorize('admin'), deleteCategory);

router.get('/products', authenticate, getProducts);
router.post('/products', authenticate, authorize('admin', 'manager'), createProduct);
router.put('/products/:id', authenticate, authorize('admin', 'manager'), updateProduct);
router.delete('/products/:id', authenticate, authorize('admin'), deleteProduct);

router.post('/upload', authenticate, authorize('admin', 'manager'), productImageUpload.single('image'), uploadProductImage);

module.exports = router;
