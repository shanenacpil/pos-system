const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.getAll = (req, res) => {
  res.json(Sale.getAll());
};

exports.getById = (req, res) => {
  const sale = Sale.getById(req.params.id);
  if (!sale) return res.status(404).json({ message: 'Sale not found' });
  res.json(sale);
};

exports.create = (req, res) => {
  const {
    items,
    customerId,
    tax = 0,
    paymentStatus = 'unpaid',
    paymentMode = 'cash',
    note = ''
  } = req.body;

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

exports.update = (req, res) => {
  const updated = Sale.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Sale not found' });
  res.json(updated);
};

exports.remove = (req, res) => {
  const success = Sale.delete(req.params.id);
  if (!success) return res.status(404).json({ message: 'Sale not found' });
  res.status(204).send();
};
