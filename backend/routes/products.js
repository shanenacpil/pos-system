const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');

// Public route
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Protected routes
router.post('/', auth, productController.create);
router.put('/:id', auth, productController.update);
router.delete('/:id', auth, productController.remove);

module.exports = router;

router.get('/low-stock', auth, productController.lowStock);
