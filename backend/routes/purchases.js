const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

router.get('/', (req, res) => res.json(Purchase.getAll()));

router.post('/', (req, res) => {
  const { supplierId, items, note } = req.body;

  const supplier = Supplier.getById(supplierId);
  if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

  // Update product stock
  items.forEach(item => {
    const product = Product.getById(item.productId);
    if (product) {
      const newStock = (product.stock || 0) + item.quantity;
      Product.update(item.productId, { stock: newStock });
    }
  });

  const purchase = Purchase.create({ supplierId, items, note });
  res.status(201).json(purchase);
});

module.exports = router;

router.post('/return/:purchaseId', (req, res) => {
  const purchase = Purchase.getById(req.params.purchaseId);
  if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

  purchase.items.forEach(item => {
    const product = Product.getById(item.productId);
    if (product) {
      const newStock = (product.stock || 0) - item.quantity;
      Product.update(item.productId, { stock: newStock });
    }
  });

  res.json({
    message: `Stock reversed for Purchase #${purchase.id}`,
    reverted: purchase.items.length,
    purchaseId: purchase.id
  });
});

