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
  const { from, to } = req.query;
  const filtered = Sale.getAll().filter(sale => isWithinRange(sale.createdAt, from, to));

  const totalSales = filtered.reduce((sum, s) => sum + s.total, 0);
  res.json({ count: filtered.length, totalSales, sales: filtered });
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
  const { from, to } = req.query;
  const filtered = Sale.getAll().filter(sale => isWithinRange(sale.createdAt, from, to));

  const totalTax = filtered.reduce((sum, s) => sum + (s.tax || 0), 0);
  res.json({ count: filtered.length, totalTax });
  });
});

// 4. Profit Margin Report
router.get('/profit', (req, res) => {
  const { from, to } = req.query;
  const sales = Sale.getAll().filter(sale => isWithinRange(sale.createdAt, from, to));

  let totalProfit = 0;
  const profitItems = [];

  sales.forEach(sale => {
    sale.items.forEach(item => {
      const product = Product.getById(item.productId);
      if (product) {
        const profit = (item.price - product.cost) * item.quantity;
        totalProfit += profit;
        profitItems.push({
          productId: product.id,
          name: product.name,
          qty: item.quantity,
          profit
        });
      }
    });
  });

  res.json({ totalProfit: totalProfit.toFixed(2), products: profitItems });
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

