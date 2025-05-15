const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/authMiddleware');

// All routes are protected
router.get('/', auth, customerController.getAll);
router.get('/:id', auth, customerController.getById);
router.post('/', auth, customerController.create);
router.put('/:id', auth, customerController.update);
router.delete('/:id', auth, customerController.remove);

module.exports = router;

