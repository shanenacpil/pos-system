const Payment = require('../models/Payment');
const Sale = require('../models/Sale');

exports.create = (req, res) => {
  const { saleId, amount, method, note = '' } = req.body;

  const sale = Sale.getById(saleId);
  if (!sale) {
    return res.status(404).json({ message: 'Sale not found' });
  }

  const payment = Payment.create({ saleId, amount, method, note });

  // Calculate total paid
  const allPayments = Payment.getBySaleId(saleId);
  const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

  // Update sale status
  const newStatus =
    totalPaid >= sale.total ? 'paid' :
    totalPaid > 0 ? 'partial' : 'unpaid';

  Sale.update(saleId, {
    paymentStatus: newStatus
  });

  res.status(201).json({ payment, totalPaid, newStatus });
};

exports.getBySale = (req, res) => {
  const payments = Payment.getBySaleId(req.params.saleId);
  res.json(payments);
};
