// routes/offers.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// POST: Create a new offer
router.post('/', (req, res) => {
  const { listing_id, user_id, offer_amount } = req.body;
  if (!listing_id || !user_id || !offer_amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const query = `INSERT INTO offers (listing_id, user_id, offer_amount) VALUES (?, ?, ?)`;
  db.run(query, [listing_id, user_id, offer_amount], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(201).json({ message: "Offer made successfully", offerId: this.lastID });
  });
});

// GET: Retrieve offers for a specific listing
router.get('/:listing_id', (req, res) => {
  const { listing_id } = req.params;
  const query = `
    SELECT offers.*, users.email as user_email 
    FROM offers 
    JOIN users ON offers.user_id = users.id 
    WHERE offers.listing_id = ? 
    ORDER BY offers.date_made DESC
  `;
  db.all(query, [listing_id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(rows);
  });
});

module.exports = router;