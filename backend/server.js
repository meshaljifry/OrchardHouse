const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison
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

// Route to handle login requests
app.post('/api/UserAccount', (req, res) => {
  const { username, password } = req.body;

  // Debug: Log the received body
  console.log('Received login request:', req.body);

  if (!username || !password) {
    return res.status(400).send({ error: 'Username or password missing' });
  }

  // Query the database for all users and their password hashes
  const sql = 'SELECT username, passwordHash FROM UserAccount';
  db.query(sql, async (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Database error' });
    }

    // Loop through users to find a matching username
    for (let i = 0; i < results.length; i++) {
      const user = results[i];
      
      // Check if username matches
      if (user.username === username) {
        // Compare the submitted password with the stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        
        if (isMatch) {
          return res.status(200).send({ message: 'Login successful' });
        } else {
          return res.status(400).send({ error: 'Incorrect password' });
        }
      }
    }

    // If no user was found with the matching username
    return res.status(400).send({ error: 'User not found' });
  });
});

// Define a default route for the root URL (optional)
app.get('/', (req, res) => {
  res.send('API is running. Use /api/Item to fetch items and /api/login to handle login.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
