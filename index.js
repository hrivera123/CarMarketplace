// index.js
const express = require('express');
const cors = require('cors');
const db = require('./db/database');

// Import routes
const authRoutes = require('./routes/auth');
const listingsRoutes = require('./routes/listings');
const offersRoutes = require('./routes/offers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());          // Enable CORS
app.use(express.json());  // Parse JSON request bodies

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/offers', offersRoutes);

// Test route to confirm server is running
app.get('/', (req, res) => {
  res.send('Hello from Final Project backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});