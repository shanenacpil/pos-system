const express = require('express');
const router = express.Router();

const Purchase = require('../models/Purchase');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

router.get('/:purchaseId', (req, res) => {
  const purchase = Purchase.getById(req.params.purchaseId);
  if (!purchase) return res.status(404).send('Purchase not found');

  const supplier = Supplier.getById(purchase.supplierId) || {
    name: 'Unknown Supplier',
    contact: '',
    address: '',
    phone: ''
  };

  const itemsHtml = purchase.items.map((item, index) => {
    const product = Product.getById(item.productId) || {};
    const unitPrice = product.cost || 0;
    const qty = item.quantity || 0;
    const lineTotal = unitPrice * qty;

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${product.name || '-'}</td>
        <td>${product.sku || '-'}</td>
        <td>${product.barcode || '-'}</td>
        <td>${product.brand || '-'}</td>
        <td>${product.size || '-'}</td>
        <td>${qty}</td>
        <td>pcs</td>
        <td>AED ${unitPrice.toFixed(2)}</td>
        <td>AED ${lineTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const subtotal = purchase.items.reduce((sum, item) => {
    const product = Product.getById(item.productId) || {};
    const unitPrice = product.cost || 0;
    return sum + (unitPrice * item.quantity);
  }, 0);

  res.send(`
    <html>
      <head>
        <title>Purchase Order #${purchase.id}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2, h4 { margin-bottom: 0; }
          p { margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f4f4f4; }
          .no-print { margin-bottom: 20px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <button class="no-print" onclick="window.print()">🖨 Print / Save as PDF</button>
        
        <h2>Purchase Order #${purchase.id}</h2>
        <p><strong>Date:</strong> ${new Date(purchase.createdAt).toLocaleString()}</p>
        
        <h4>Vendor Information</h4>
        <p><strong>Name:</strong> ${supplier.name}</p>
        <p><strong>Address:</strong> ${supplier.address || '-'}</p>
        <p><strong>Contact Person:</strong> ${supplier.contact || '-'}</p>
        <p><strong>Contact Number:</strong> ${supplier.phone || '-'}</p>

        <h4>Delivery Address</h4>
        <p>Warehouse, Dubai, UAE</p>

        <table>
          <thead>
            <tr>
              <th>SN</th>
              <th>Item Name</th>
              <th>SKU</th>
              <th>Barcode</th>
              <th>Brand</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Unit</th>
              <th>Unit Price</th>
              <th>Line Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <h4 style="text-align: right; margin-top: 30px;">
          Subtotal: AED ${subtotal.toFixed(2)}<br/>
          Total: <strong>AED ${subtotal.toFixed(2)}</strong>
        </h4>

        <p><strong>Note:</strong> ${purchase.note || 'N/A'}</p>
      </body>
    </html>
  `);
});

module.exports = router;
