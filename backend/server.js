const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

// Middleware to parse JSON and enable CORS
app.use(cors());
app.use(express.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'appleorcharddatabase.cz04caw0ahsw.us-east-2.rds.amazonaws.com', // Your MySQL host
  user: 'admin',    // Your MySQL username
  password: 'jD1mOUsCvcIxk7PTH2iV', // Your MySQL password
  database: 'AppleOrchardSystem'    // Your database name
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Route to get items from the database (excluding ID)
app.get('/api/Item', (req, res) => {
  const sql = 'SELECT Name, Description, price FROM Item'; // Excluding the ID field
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Define a default route for the root URL (optional)
app.get('/', (req, res) => {
  res.send('API is running. Use /api/Item to fetch items.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
