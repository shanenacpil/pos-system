const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

router.get('/', (req, res) => res.json(Supplier.getAll()));
router.get('/:id', (req, res) => {
  const s = Supplier.getById(req.params.id);
  if (!s) return res.status(404).json({ message: 'Supplier not found' });
  res.json(s);
});
router.post('/', (req, res) => res.status(201).json(Supplier.create(req.body)));
router.put('/:id', (req, res) => {
  const updated = Supplier.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Supplier not found' });
  res.json(updated);
});
router.delete('/:id', (req, res) => {
  const ok = Supplier.delete(req.params.id);
  if (!ok) return res.status(404).json({ message: 'Supplier not found' });
  res.status(204).send();
});

module.exports = router;
