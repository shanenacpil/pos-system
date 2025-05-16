const express = require('express');
const cors = require('cors'); // Added CORS

const app = express();
app.use(cors()); // Enabled CORS
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

app.get('/', (req, res) => res.send('POS system is live!'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

const customerRoutes = require('./routes/customers');
app.use('/api/customers', customerRoutes);

const saleRoutes = require('./routes/sales');
app.use('/api/sales', saleRoutes);

const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

const invoiceRoutes = require('./routes/invoices');
app.use('/api/invoices', invoiceRoutes);

const printableInvoiceRoutes = require('./routes/printableInvoice');
app.use('/print/invoice', printableInvoiceRoutes);

const invoicePdfRoutes = require('./routes/invoicePdf');
app.use('/api/invoice/pdf', invoicePdfRoutes);





