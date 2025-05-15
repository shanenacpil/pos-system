const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, paymentController.create);
router.get('/:saleId', auth, paymentController.getBySale);

module.exports = router;

