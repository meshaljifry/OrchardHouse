const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'appleorcharddatabase.cz04caw0ahsw.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'jD1mOUsCvcIxk7PTH2iV',
  database: 'AppleOrchardSystem'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/api/Item', (req, res) => {

  const sql = 'SELECT Name AS name, Description AS description, price FROM Item';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});




// server.js
app.get('/api/UserAccount', (req, res) => {
  const username = req.query.username;
  
  // Modified query to join UserAccount with User table to retrieve RoleID
  const query = `
    SELECT UA.passwordHash, U.RoleID
    FROM AppleOrchardSystem.UserAccount UA
    JOIN AppleOrchardSystem.User U ON UA.userID = U.userID
    WHERE UA.username = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Error querying the database');
      return;
    }

    if (results.length > 0) {
      res.json(results[0]);  // Send passwordHash and RoleID
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Update a product
app.put('/api/Item/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const sql = 'UPDATE Item SET Name = ?, Price = ? WHERE id = ?';
  db.query(sql, [name, price, id], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send('Error updating product');
    }
    res.sendStatus(200);
  });
});

// Add a new product
app.post('/api/Item', (req, res) => {
  const { name, price } = req.body;
  const sql = 'INSERT INTO Item (Name, Price) VALUES (?, ?)';
  db.query(sql, [name, price], (err, results) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).send('Error adding product');
    }
    res.sendStatus(201);
  });
});




// Define a default route for the root URL (optional)

app.get('/', (req, res) => {
  res.send('API is running. Use /api/Item to fetch items and /api/UserAccount to handle login.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
