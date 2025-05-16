const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf-node');

const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');

router.get('/:saleId', async (req, res) => {
  const sale = Sale.getById(req.params.saleId);
  if (!sale) return res.status(404).send('Sale not found');

  const customer = Customer.getById(sale.customerId) || { name: 'Walk-in', group: 'retail' };
  const payments = Payment.getBySaleId(sale.id) || [];

  const itemsHtml = sale.items.map(item => {
    const product = Product.getById(item.productId) || {};
    const total = (item.price - (item.discount || 0)) * item.quantity;
    return `
      <tr>
        <td>${product.name || 'Unknown'}</td>
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
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
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
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p><strong>Subtotal:</strong> AED ${sale.subtotal.toFixed(2)}</p>
        <p><strong>Tax:</strong> AED ${sale.tax.toFixed(2)}</p>
        <p><strong>Total:</strong> AED ${sale.total.toFixed(2)}</p>
        <p><strong>Note:</strong> ${sale.note}</p>
      </body>
    </html>
  `;

  const file = { content: html };

  const options = { format: 'A4' };

  const pdfBuffer = await pdf.generatePdf(file, options);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename=invoice-${sale.id}.pdf`
  });

  res.send(pdfBuffer);
});

module.exports = router;
