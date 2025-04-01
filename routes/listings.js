// routes/listings.js
const express = require('express');
const router = express.Router();
const db = require('../db/database');
const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the timestamp and original filename
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// CREATE a listing with file upload support
router.post('/', upload.array('images', 5), (req, res) => {
  const {
    seller_id,
    make,
    model,
    year,
    mileage,
    price,
    transmission,
    fuelType,
    bodyType,
    color,
    description,
  } = req.body;

  // Retrieve file paths from req.files
  let images = [];
  if (req.files) {
    images = req.files.map(file => file.path);
  }
  const imagesJSON = JSON.stringify(images);

  const query = `
    INSERT INTO car_listings
    (seller_id, make, model, year, mileage, price, transmission, fuelType, bodyType, color, images, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    seller_id, make, model, year, mileage, price, transmission,
    fuelType, bodyType, color, imagesJSON, description
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(201).json({ message: 'Listing created', listingId: this.lastID });
  });
});

// GET all listings
router.get('/', (req, res) => {
  const query = `
    SELECT car_listings.*, users.email as seller_email
    FROM car_listings
    JOIN users ON car_listings.seller_id = users.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    // Convert images JSON string to an array for each row
    const listings = rows.map(row => ({
      ...row,
      images: row.images ? JSON.parse(row.images) : []
    }));
    res.status(200).json(listings);
  });
});

// GET a single listing by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT car_listings.*, users.email as seller_email
    FROM car_listings
    JOIN users ON car_listings.seller_id = users.id
    WHERE car_listings.id = ?
  `;
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    row.images = row.images ? JSON.parse(row.images) : [];
    res.status(200).json(row);
  });
});

// DELETE a listing
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM car_listings WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json({ message: 'Listing deleted successfully' });
  });
});

module.exports = router;