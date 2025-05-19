const express = require('express');
const router = express.Router();

const Purchase = require('../models/Purchase');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

router.get('/:purchaseId', (req, res) => {
  const purchase = Purchase.getById(req.params.purchaseId);
  if (!purchase) return res.status(404).send('Purchase not found');

  const supplier = Supplier.getById(purchase.supplierId) || { name: 'Unknown Supplier' };

  const itemsHtml = purchase.items.map(item => {
    const product = Product.getById(item.productId) || {};
    return `
      <tr>
        <td>${product.name || 'Unknown'}</td>
        <td>${item.quantity}</td>
      </tr>
    `;
  }).join('');

  res.send(`
    <html>
      <head>
        <title>Purchase Order #${purchase.id}</title>
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
        <h2>Purchase Order #${purchase.id}</h2>
        <p><strong>Date:</strong> ${new Date(purchase.createdAt).toLocaleString()}</p>
        <p><strong>Supplier:</strong> ${supplier.name}</p>
        <p><strong>Note:</strong> ${purchase.note}</p>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </body>
    </html>
  `);
});

module.exports = router;
