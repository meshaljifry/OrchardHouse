// server.js
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

  const sql = 'SELECT itemID, Name AS name, Description AS description, price, Image AS image FROM Item';

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("An error occurred while fetching items");
    }

    // Convert the blob to a Base64 string for each item
    const items = results.map(item => {
      return {
        ...item,
        image: item.image ? `data:image/png;base64,${item.image.toString('base64')}` : null
      };
    });

    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  });
});

app.get('/api/UserAccount', (req, res) => {
  const username = req.query.username;
 
  const passwordHash = req.query.passwordHash;
  const query = `
    SELECT UA.passwordHash, U.roleID , UA.userID
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
      const { passwordHash, roleID,userID } = results[0];
      console.log('roleID fetched from database:', roleID);
      console.log('userID fetched from database:', userID); // Logging roleID for visibility
      res.json({ passwordHash, roleID,userID });
    } else {
      res.status(401).send('Incorrect username or password');
    }
  });
});

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


// Fetch tasks from the Task table
app.get('/api/getTasks', (req, res) => {
  const sql = 'SELECT taskID, code, name, description, animalID, plantID, supplyID, reportID FROM Task';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Task table:', err);
      return res.status(500).send('Error querying the Task table');
    }
    res.json(results);
  });
});

app.get('/api/getAssignedTasks', (req, res) => {
  const sql = 'SELECT assignedTaskID, userID, assignerID, taskID, statusID, dateScheduledFor, date FROM AssignedTask';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the AssignedTask table:', err);
      return res.status(500).send('Error querying the AssignedTask table');
    }
    res.json(results);
  });
});




app.get('/api/getComments', (req, res) => {
  const sql = 'SELECT assignedTaskID, comment FROM AssignedTaskComment';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Task table:', err);
      return res.status(500).send('Error querying the Task table');
    }
    res.json(results);
  });
});

// Create a new task
app.post('/api/createTask', (req, res) => {   
  const {code, name, description, animalID, plantID, supplyID, reportID } = req.body;   
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

app.post('/api/createTransaction', (req, res) => {
  const { date, userID, cart, paymentType, cardNumber, cardExpiration, cardCode} = req.body;

  // Insert into the Transaction table
  const insertTransactionSql = `INSERT INTO Transaction (date, userID) VALUES (?, ?)`;
  
  db.query(insertTransactionSql, [date || null, userID], (err, result) => {
    if (err) {
      console.error('Error inserting transaction:', err);
      return res.status(500).send('Error inserting transaction');
    }
    //Get transactionID Back
    const transactionID = result.insertId; // Get the last inserted ID

    // Insert into the TransactionItem table
    const insertTransactionItemSql = `INSERT INTO TransactionItem (transactionID, itemID, cartRentalID, unitPrice, discountID, quantity) VALUES ?`;

    const itemsToInsert = cart.map(item => [transactionID, item.itemID || null, item.cartRentalID || null, item.price, item.discountID || null, item.quantity]);

    db.query(insertTransactionItemSql, [itemsToInsert], (err) => {
      if (err) {
        console.error('Error inserting transaction items:', err);
      }
      res.status(201).json({ transactionID, message: 'Transaction created successfully' });
    });

    // Insert into the TransactionPayment table
    const insertTransactionPaymentSql = `INSERT INTO TransactionPayment (transactionID, paymentType, cardNumber, cardExpiration, cardCode) VALUES (?, ?, ?, ?, ?)`;

    db.query(insertTransactionPaymentSql, [transactionID, paymentType, cardNumber || null, cardExpiration || null, cardCode || null] , (err, result) => {
      if (err) {
        console.error('Error inserting transaction:', err);
        return res.status(500).send('Error inserting transaction');
      }
    });

  });
});

// Assign Task Endpoint
app.post('/api/assignTask', async (req, res) => {
  const {userID, assignerID, taskID, statusID, dateScheduledFor, date} = req.body;   
  const sql = `INSERT INTO AssignedTask (userID, assignerID, taskID, statusID, dateScheduledFor, date)     
  VALUES (?, ?, ?, ?, ?, ?)   `;
  const values = [userID, assignerID, taskID, statusID || 3, dateScheduledFor || null, date || null];
  db.query(sql, values, (err, result) => {     
  if (err) { 
    console.error('Error inserting AssignedTask:', err);       
    return res.status(500).send('Error inserting AssignedTask'); 
  } 
  res.status(201).send('Task created successfully'); 
  }); 
});

app.put('/api/TaskStatus/:taskID', (req, res) => {
  const { taskID } = req.params;
  const { statusID } = req.body;
  const sql = 'UPDATE AssignedTask SET statusID = ? WHERE taskID = ?';
  db.query(sql, [statusID, taskID], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send('Error updating product');
    }
    res.sendStatus(200);
  });
});

app.post('/api/commentTask', async (req,res) => {
  const {assignedTaskID, comment} = req.body;
  const sql = 'INSERT INTO AssignedTaskComment (assignedTaskID, comment) VALUES (?, ?)';
  const values = [assignedTaskID, comment]
  db.query(sql, values, (err, result) =>{
  if (err) { 
    console.error('Error inserting AssignedTaskComment:', err);       
    return res.status(500).send('Error inserting AssignedTaskComment'); 
  } 
  res.status(201).send('Task comment created successfully'); 
  });
});

// Get User List Endpoint
app.get('/api/getUserList', async (req, res) => {
  const sql = 'SELECT userID, firstName, lastName FROM User';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the User table:', err);
      return res.status(500).send('Error querying the User table');
    }
    res.json(results);
  });
});

// Get Event List Endpoint
app.get('/api/getEventList', async (req, res) => {
  const sql = 'SELECT eventID, scheduledDate, title, description FROM Event';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the User table:', err);
      return res.status(500).send('Error querying the Events table');
    }
    res.json(results);
  });
});

app.get('/', (req, res) => {
  res.send('API is running. Use /api/Item to fetch items and /api/UserAccount to handle login.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
