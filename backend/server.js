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

app.post('/api/UserAccount', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', req.body);

  if (!username || !password) {
    return res.status(400).send({ error: 'Username or password missing' });
  }

  const sql = 'SELECT username, passwordHash FROM UserAccount';
  db.query(sql, async (err, results) => {
    if (err) {
      return res.status(500).send({ error: 'Database error' });
    }

    for (let i = 0; i < results.length; i++) {
      const user = results[i];
      
      if (user.username === username) {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        
        if (isMatch) {
          return res.status(200).send({ message: 'Login successful' });
        } else {
          return res.status(400).send({ error: 'Incorrect password' });
        }
      }
    }

    return res.status(400).send({ error: 'User not found' });
  });
});

app.get('/', (req, res) => {
  res.send('API is running. Use /api/Item to fetch items and /api/login to handle login.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
