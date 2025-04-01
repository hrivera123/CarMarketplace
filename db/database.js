// db/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use path to create an absolute path to your DB file
const dbPath = path.resolve(__dirname, 'car-marketplace.db');

// Create and/or open the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create tables if they don't already exist
db.serialize(() => {
  // USERS table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

    // Create OFFERS table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      offer_amount REAL NOT NULL,
      date_made DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (listing_id) REFERENCES car_listings(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // CAR LISTINGS table
  db.run(`
    CREATE TABLE IF NOT EXISTS car_listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      seller_id INTEGER NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      mileage INTEGER,
      price REAL NOT NULL,
      transmission TEXT,
      fuelType TEXT,
      bodyType TEXT,
      color TEXT,
      images TEXT,         -- We'll store JSON string for images
      description TEXT,
      FOREIGN KEY (seller_id) REFERENCES users (id)
    )
  `);
});

module.exports = db;
