const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');

// Middleware to parse JSON
app.use(express.json());

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => res.send('POS system is live!'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
