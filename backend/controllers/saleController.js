exports.create = (req, res) => {
  const {
    items,
    customerId,
    tax = 0,
    paymentStatus = 'unpaid',
    paymentMode = 'cash',
    note = ''
  } = req.body;

  const Product = require('../models/Product'); // ✅ Only keep this ONCE

  // Block overselling
  for (let item of items) {
    const product = Product.getById(item.productId);
    if (!product) {
      return res.status(404).json({ message: `Product not found: ${item.productId}` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
      });
    }
  }

  const subtotal = items.reduce((acc, item) => {
    const itemTotal = (item.price - (item.discount || 0)) * item.quantity;
    return acc + itemTotal;
  }, 0);

  const total = subtotal + tax;

  // Reduce stock for each product sold
  items.forEach(item => {
    const product = Product.getById(item.productId);
    if (product) {
      const newStock = (product.stock || 0) - item.quantity;
      Product.update(item.productId, { stock: newStock });
    }
  });

  const sale = Sale.create({
    customerId,
    items,
    subtotal,
    tax,
    total,
    paymentStatus,
    paymentMode,
    note
  });

  res.status(201).json(sale);
};
