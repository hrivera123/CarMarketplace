// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/database');

// REGISTER user
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (row) {
      return res.status(400).json({ message: 'User already exists' });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.run(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword],
        function (err2) {
          if (err2) {
            console.error(err2);
            return res.status(500).json({ message: 'Error creating user' });
          }
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error hashing password' });
    }
  });
});

// LOGIN user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // At this point, credentials are valid
      // In a real app, you'd generate a JWT token here
      res.status(200).json({
        message: 'Login successful',
        userId: user.id
        // token: 'some-jwt-token' // Example if you add JWT
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error comparing passwords' });
    }
  });
});

module.exports = router;