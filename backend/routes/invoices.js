const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');

router.get('/:saleId', auth, (req, res) => {
  const sale = Sale.getById(req.params.saleId);
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' });
  }

  const customer = Customer.getById(sale.customerId);
  const payments = Payment.getBySaleId(sale.id);

  const detailedItems = sale.items.map(item => {
    const product = Product.getById(item.productId);
    return {
      productName: product?.name || 'Unknown Product',
      sku: product?.sku,
      quantity: item.quantity,
      unitPrice: item.price,
      discount: item.discount || 0,
      total: (item.price - (item.discount || 0)) * item.quantity
    };
  });

  const response = {
    invoiceId: sale.id,
    date: sale.createdAt,
    customer: customer || { name: 'Walk-in', group: 'retail' },
    paymentMode: sale.paymentMode,
    paymentStatus: sale.paymentStatus,
    note: sale.note,
    items: detailedItems,
    subtotal: sale.subtotal,
    tax: sale.tax,
    total: sale.total,
    payments: payments || []
  };

  res.json(response);
});

module.exports = router;
