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

app.get('/api/UserAccount', (req, res) => {
  const username = req.query.username;
  const query = "SELECT passwordHash FROM AppleOrchardSystem.UserAccount WHERE username = ?";
  
  db.query(query, [username], (err, results) => {

    if (err) {
      res.status(500).send('Error querying the database');
      return;
    }


    if (results.length > 0) {
      res.json(results[0].passwordHash);
    } else {
      res.status(404).send('User not found');
    }
  });

});

// Fetch animals from the Animal table
app.get('/api/getAnimalList', (req, res) => {
  const sql = 'SELECT animalID, name, species, location, statusID FROM Animal';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Animal table:', err);
      return res.status(500).send('Error querying the Animal table');
    }
    res.json(results);
  });
});

// Fetch plants from the Plant table
app.get('/api/getPlantList', (req, res) => {
  const sql = 'SELECT plantID, name, location, statusID FROM Plant';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Plant table:', err);
      return res.status(500).send('Error querying the Plant table');
    }
    res.json(results);
  });
});

// Fetch supplies from the Supply table
app.get('/api/getSupplyList', (req, res) => {
  const sql = 'SELECT supplyID, name FROM Supply';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Supply table:', err);
      return res.status(500).send('Error querying the Supply table');
    }
    res.json(results);
  });
});

// Fetch reports from the Report table
app.get('/api/getReportList', (req, res) => {
  const sql = 'SELECT reportID, description FROM Report';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Report table:', err);
      return res.status(500).send('Error querying the Report table');
    }
    res.json(results);
  });
});

// Create a new task
app.post('/api/createTask', (req, res) => {   
  const {code, name, description, animalID, plantID, supplyID, reportID } = req.body;   
  var countID;  
  const sql = `INSERT INTO Task (code, name, description, animalID, plantID, supplyID, reportID)     
  VALUES (?, ?, ?, ?, ?, ?, ?)   `;     
  db.query(sql, [code || null, name, description, animalID || null, plantID || null, supplyID || null, reportID || null], (err, result) => {     
  if (err) { 
    console.error('Error inserting task:', err);       
    return res.status(500).send('Error inserting task'); 
  } 
  res.status(201).send('Task created successfully'); 
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
