const isWithinRange = (date, from, to) => {
  const d = new Date(date);
  return (!from || d >= new Date(from)) && (!to || d <= new Date(to));
};

const express = require('express');
const router = express.Router();

const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// 1. Sales Report (optional filter: from, to)
router.get('/sales', (req, res) => {
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;

  let filteredSales = Sale.getAll();

  if (from || to) {
    filteredSales = filteredSales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return (!from || saleDate >= from) && (!to || saleDate <= to);
    });
  }

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  res.json({
    count: filteredSales.length,
    totalSales,
    sales: filteredSales
  });
});

// 2. Inventory Report
router.get('/inventory', (req, res) => {
  const products = Product.getAll();
  const lowStock = products.filter(p => p.stock !== undefined && p.stock <= (p.lowStock || 0));
  const zeroStock = products.filter(p => (p.stock || 0) === 0);

  res.json({
    totalProducts: products.length,
    lowStock,
    zeroStock
  });
});

// 3. Tax Report
router.get('/taxes', (req, res) => {
  const sales = Sale.getAll();
  const totalTax = sales.reduce((sum, sale) => sum + (sale.tax || 0), 0);

  res.json({
    count: sales.length,
    totalTax
  });
});

// 4. Profit Margin Report
router.get('/profit', (req, res) => {
  const sales = Sale.getAll();
  const profitItems = [];

  let totalProfit = 0;

  sales.forEach(sale => {
    sale.items.forEach(item => {
      const product = Product.getById(item.productId);
      if (product) {
        const cost = product.cost || 0;
        const sellPrice = item.price || 0;
        const qty = item.quantity || 0;
        const profit = (sellPrice - cost) * qty;
        totalProfit += profit;

        profitItems.push({
          productId: product.id,
          name: product.name,
          qty,
          profit
        });
      }
    });
  });

  res.json({
    totalProfit: totalProfit.toFixed(2),
    products: profitItems
  });
});

// 5. Customer Balances
router.get('/balances', (req, res) => {
  const customers = Customer.getAll();
  const withBalance = customers.filter(c => (c.balance || 0) > 0);

  res.json({
    totalCustomers: customers.length,
    outstanding: withBalance.length,
    balances: withBalance
  });
});

module.exports = router;

