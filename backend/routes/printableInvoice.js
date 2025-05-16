const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Payment = require('../models/Payment');

router.get('/:saleId', (req, res) => {
  const sale = Sale.getById(req.params.saleId);
  if (!sale) return res.status(404).send('Sale not found');

  const customer = Customer.getById(sale.customerId) || { name: 'Walk-in', group: 'retail' };
  const payments = Payment.getBySaleId(sale.id) || [];

  const itemsHtml = sale.items.map(item => {
    const product = Product.getById(item.productId) || {};
    const total = (item.price - (item.discount || 0)) * item.quantity;
    return `
      <tr>
        <td>${product.name || 'Unknown Product'}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toFixed(2)}</td>
        <td>${item.discount || 0}</td>
        <td>${total.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <html>
      <head>
        <title>Invoice #${sale.id}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { margin-bottom: 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f2f2f2; }
        </style>
      </head>
      <body>
        <h2>Invoice #${sale.id}</h2>
        <p><strong>Date:</strong> ${new Date(sale.createdAt).toLocaleString()}</p>
        <p><strong>Customer:</strong> ${customer.name} (${customer.group})</p>
        <p><strong>Payment Mode:</strong> ${sale.paymentMode}</p>
        <p><strong>Status:</strong> ${sale.paymentStatus}</p>

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
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p><strong>Subtotal:</strong> AED ${sale.subtotal.toFixed(2)}</p>
        <p><strong>Tax:</strong> AED ${sale.tax.toFixed(2)}</p>
        <p><strong>Total:</strong> AED ${sale.total.toFixed(2)}</p>

        <hr />
        <p><strong>Note:</strong> ${sale.note}</p>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

module.exports = router;
