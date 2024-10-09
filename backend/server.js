const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
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
  const passwordHash = req.query.passwordHash;
  // Modified query to join UserAccount with User table to retrieve RoleID
  const query = `
    SELECT UA.passwordHash, U.RoleID
    FROM AppleOrchardSystem.UserAccount UA
    JOIN AppleOrchardSystem.User U ON UA.userID = U.userID
    WHERE UA.username = ? AND UA.passwordHash = sha2(?, 512)
  `;


  db.query(query, [username, passwordHash], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      res.status(500).send('Error querying the database');
      return;
    }

    if (results.length > 0) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).send('Incorrect username or password');
    }
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
