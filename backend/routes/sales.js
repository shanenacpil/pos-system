const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, saleController.getAll);
router.get('/:id', auth, saleController.getById);
router.post('/', auth, saleController.create);
router.put('/:id', auth, saleController.update);
router.delete('/:id', auth, saleController.remove);

module.exports = router;

