const Product = require('../models/Product');

exports.getAll = (req, res) => {
  res.json(Product.getAll());
};

exports.getById = (req, res) => {
  const product = Product.getById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.create = (req, res) => {
  const product = Product.create(req.body);
  res.status(201).json(product);
};

exports.update = (req, res) => {
  const updated = Product.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
};

exports.remove = (req, res) => {
  const success = Product.delete(req.params.id);
  if (!success) return res.status(404).json({ message: 'Product not found' });
  res.status(204).send();
};
