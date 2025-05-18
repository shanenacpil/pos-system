const Customer = require('../models/Customer');

exports.getAll = (req, res) => {
  res.json(Customer.getAll());
};

exports.getById = (req, res) => {
  const customer = Customer.getById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

exports.create = (req, res) => {
const newCustomer = {
  id: req.body.id || `CUST${Date.now().toString().slice(-5)}`,
  ...req.body
};


  Customer.create(newCustomer);
  res.status(201).json(newCustomer);
};

exports.update = (req, res) => {
  const updated = Customer.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Customer not found' });
  res.json(updated);
};

exports.remove = (req, res) => {
  const success = Customer.delete(req.params.id);
  if (!success) return res.status(404).json({ message: 'Customer not found' });
  res.status(204).send();
};
