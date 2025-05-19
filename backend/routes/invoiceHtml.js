const express = require('express');
const router = express.Router();

const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');

router.get('/:saleId', (req, res) => {
  const sale = Sale.getById(req.params.saleId);
  if (!sale) return res.status(404).send('Sale not found');

  const customer = Customer.getById(sale.customerId) || { name: "Walk-in", group: "retail" };
  const payments = Payment.getBySaleId(sale.id) || [];

  const itemsHtml = sale.items.map(item => {
    const product = Product.getById(item.productId) || {};
    const price = item.price || 0;
    const discount = item.discount || 0;
    const quantity = item.quantity || 0;
    const total = (price - discount) * quantity;
    return `
      <tr>
        <td>${product.name || 'Unknown'}</td>
        <td>${quantity}</td>
        <td>${price.toFixed(2)}</td>
        <td>${discount}</td>
        <td>${total.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  res.send(`
    <html>
      <head>
        <title>Invoice ${sale.id}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; }
          th { background-color: #f4f4f4; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="no-print" onclick="window.print()">🖨 Print / Save as PDF</button>
        <h2>Invoice #${sale.id}</h2>
        <p><strong>Date:</strong> ${new Date(sale.createdAt).toLocaleString()}</p>
        <p><strong>Customer:</strong> ${customer.name} (${customer.group})</p>
        <p><strong>Payment:</strong> ${sale.paymentMode} - ${sale.paymentStatus}</p>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
        <p><strong>Subtotal:</strong> AED ${(sale.subtotal || 0).toFixed(2)}</p>
        <p><strong>Tax:</strong> AED ${(sale.tax || 0).toFixed(2)}</p>
        <p><strong>Total:</strong> AED ${(sale.total || 0).toFixed(2)}</p>
        <p><strong>Note:</strong> ${sale.note || ''}</p>
      </body>
    </html>
  `);
});

module.exports = router;
