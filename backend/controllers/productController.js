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

exports.lowStock = (req, res) => {
  const lowStockItems = Product.getAll().filter(p => p.stock < (p.lowStock ?? 0));
  res.json(lowStockItems);
};

exports.lowStock = (req, res) => {
  const { brand, category, size } = req.query;

  let results = Product.getAll().filter(p => p.stock < (p.lowStock ?? 0));

  if (brand) results = results.filter(p => p.brand?.toLowerCase() === brand.toLowerCase());
  if (category) results = results.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  if (size) results = results.filter(p => p.size?.toLowerCase() === size.toLowerCase());

  res.json(results);
};


