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
  const sql = 'SELECT itemID, Name AS name, Description AS description, price FROM Item';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get('/api/UserAccount', (req, res) => {
  const username = req.query.username;
  const passwordHash = req.query.passwordHash;
  const query = `
    SELECT UA.passwordHash, U.roleID
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
      const { passwordHash, roleID } = results[0];
      console.log('roleID fetched from database:', roleID); // Logging roleID for visibility
      res.json({ passwordHash, roleID });
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

// app.post('/api/createTransaction', (req, res) => {   
//   const {date, userID } = req.body;   
//   const sql = `CREATE TEMPORARY TABLE OutputTbl (transactionID INT) 
//   INSERT INTO Transaction (date, userID) 
//   VALUES (?, ?);
//   INSERT INTO OutputTbl (transactionID)
//   VALUES (LAST_INSERT_ID());
//   SELECT * FROM OutputTbl`;     
//   db.query(sql, [date || null, userID], (err, result) => {     
//   if (err) { 
//     console.error('Error inserting transaction:', err);       
//     return res.status(500).send('Error inserting transaction'); 
//   } 
//   res.status(201).send('Transaction created successfully'); 
//   res.json(result); //send transactionID back
//   }); 
// });

app.post('/api/createTransaction', (req, res) => {
  const { date, userID, cart } = req.body;

  // Insert into the Transaction table
  const insertTransactionSql = `INSERT INTO Transaction (date, userID) VALUES (?, ?)`;
  
  db.query(insertTransactionSql, [date || null, userID], (err, result) => {
    if (err) {
      console.error('Error inserting transaction:', err);
      return res.status(500).send('Error inserting transaction');
    }
    //Get transactionID Back
    const transactionID = result.insertId; // Get the last inserted ID

    const insertTransactionItemSql = `INSERT INTO TransactionItem (transactionID, itemID, cartRentalID, price, discountID, quantity) VALUES (?)`;

    const itemsToInsert = cart.map(item => [transactionID, item.itemID || null, item.cartRentalID || null, item.price, item.discountID || null, item.quantity]);

    db.query(insertTransactionItemSql, [itemsToInsert], (err) => {
      if (err) {
        console.error('Error inserting transaction items:', err);
      }

      res.status(201).json({ transactionID, message: 'Transaction created successfully' });
  });
});
});


// app.post('/api/createTransactionItem', (req, res) => {   
//   const {transactionID, itemID, cartRentalID, price, discountID, quantity } = req.body;   
//   const sql = `INSERT INTO TransactionItem (transactionID, itemID, cartRentalID, price, discountID)   
//   VALUES (?, ?, ?, ?, ?)   `;     
//   db.query(sql, [transactionID, itemID || null, cartRentalID || null, price, discountID || null], (err, result) => {    //fix row  
//   if (err) { 
//     console.error('Error inserting transaction item:', err);       
//     return res.status(500).send('Error inserting transaction item'); 
//   } 
//   res.status(201).send('TransactionItem created successfully'); 
//   }); 
// });

// app.post('/api/createPayment', (req, res) => {   
//   const {transactionID, paymentType, cardNumber, cardExpiration, cardCode } = req.body;   
//   const sql = `INSERT INTO Payment (transactionID, paymentType, cardNumber, cardExpiration, cardCode)   
//   VALUES (?, ?, ?, ?, ?)   `;     
//   db.query(sql, [transactionID, paymentType, cardNumber || null, cardExpiration || null, cardCode || null], (err, result) => {  
//   if (err) { 
//     console.error('Error inserting payment', err);       
//     return res.status(500).send('Error inserting payment'); 
//   } 
//   res.status(201).send('Payment created successfully'); 
//   }); 
// });


app.get('/', (req, res) => {
  res.send('API is running. Use /api/Item to fetch items and /api/UserAccount to handle login.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
