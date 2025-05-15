const Sale = require('../models/Sale');

exports.getAll = (req, res) => {
  res.json(Sale.getAll());
};

exports.getById = (req, res) => {
  const sale = Sale.getById(req.params.id);
  if (!sale) return res.status(404).json({ message: 'Sale not found' });
  res.json(sale);
};

exports.create = (req, res) => {
  const { items, customerId, tax = 0, paymentStatus = 'unpaid', note = '' } = req.body;

  const subtotal = items.reduce((acc, item) => {
    const itemTotal = (item.price - (item.discount || 0)) * item.quantity;
    return acc + itemTotal;
  }, 0);

  const total = subtotal + tax;

  const sale = Sale.create({
    customerId,
    items,
    subtotal,
    tax,
    total,
    paymentStatus,
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
