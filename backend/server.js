// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

import { BACKEND_URL } from '../src/config.js';

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
// PUT (update) an existing product - used in Dashboard.js for editing products
app.put('/api/Item/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  
  const sql = 'UPDATE Item SET Name = ?, Price = ? WHERE itemID = ?';
  db.query(sql, [name, price, id], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send('Error updating product');
    }
    res.sendStatus(200); // Successfully updated product
  });
});

// New Endpoint: Fetch most ordered products with their total orders and revenue
app.get('/api/mostOrderedProducts', (req, res) => {
  const sql = `
    SELECT 
      i.Name AS productName,
      SUM(ti.quantity) AS totalOrders,
      SUM(ti.unitPrice * ti.quantity) AS totalRevenue
    FROM TransactionItem ti
    JOIN Item i ON ti.itemID = i.itemID
    GROUP BY i.itemID
    ORDER BY totalOrders DESC;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("An error occurred while fetching the most ordered products");
    }

    res.json(results);
  });
});

app.get('/api/TotalRevenue', (req, res) => {
  const sql = `SELECT SUM(unitPrice * quantity) AS totalRevenue FROM TransactionItem`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("An error occurred while calculating revenue");
    }

    res.json({ totalRevenue: results[0].totalRevenue || 0 });
  });
});

app.get('/api/TotalDiscount', (req, res) => {
  const sql = `SELECT 
                SUM(D.percentOff * .01 * TI.unitPrice * TI.quantity) AS totalDiscount 
              FROM Transaction AS T
              JOIN TransactionPayment AS TP ON TP.transactionID = T.transactionID
              JOIN Discount AS D ON D.discountID = TP.discountID
              JOIN TransactionItem AS TI ON TI.transactionID = T.transactionID;`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("An error occurred while calculating discount total");
    }

    res.json({ totalDiscount: results[0].totalDiscount || 0 });
  });
});

// New Endpoint: Fetch order counts for this week and last week
app.get('/api/orderComparison', (req, res) => {
  const sql = `
    SELECT 
      DAYNAME(t.date) AS dayName,
      SUM(CASE WHEN WEEK(t.date) = WEEK(CURDATE()) THEN 1 ELSE 0 END) AS thisWeek,
      SUM(CASE WHEN WEEK(t.date) = WEEK(CURDATE()) - 1 THEN 1 ELSE 0 END) AS lastWeek
    FROM Transaction t
    JOIN TransactionItem ti ON t.transactionID = ti.transactionID
    WHERE t.date >= DATE_SUB(CURDATE(), INTERVAL 2 WEEK)
    GROUP BY DAYOFWEEK(t.date)
    ORDER BY DAYOFWEEK(t.date);
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("An error occurred while fetching order comparison data");
    }

    res.json(results);
  });
});

app.get('/api/employeeTasks', (req, res) => {
  const sql = `
    SELECT 
      u.firstName AS employeeName,
      u.lastName AS employeeLastName,
      COUNT(at.assignedTaskID) AS tasksAssigned,
      SUM(CASE WHEN at.statusID = 3 THEN 1 ELSE 0 END) AS tasksCompleted
    FROM AssignedTask at
    JOIN User u ON at.userID = u.userID
    GROUP BY at.userID;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("An error occurred while fetching employee tasks data");
    }

    // Combine first name and last name for full employee name
    const formattedResults = results.map(row => ({
      employeeName: `${row.employeeName} ${row.employeeLastName}`,
      tasksAssigned: row.tasksAssigned,
      tasksCompleted: row.tasksCompleted,
    }));

    res.json(formattedResults);
  });
});
app.get('/api/employees', (req, res) => {
  const sql = `
    SELECT 
      userID AS id, 
      CONCAT(firstName, ' ', lastName) AS name 
    FROM User
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send("An error occurred while fetching employees");
    }
    res.json(results); // Return the list of employees as JSON
  });
});
// POST (add) a new product - used in Dashboard.js for adding products
app.post('/api/Item', (req, res) => {
  const { name, price } = req.body;
  
  const sql = 'INSERT INTO Item (Name, Price) VALUES (?, ?)';
  db.query(sql, [name, price], (err, results) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).send('Error adding product');
    }
    res.sendStatus(201); // Successfully added product
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

app.post('/api/checkUsername', (req, res) => {
  const { username } = req.body;
  const checkUsernameQuery = `SELECT username FROM UserAccount WHERE username = ?`;
  db.query(checkUsernameQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).json({ error: 'Error checking username' });
    }
    res.status(200).json({ exists: results.length > 0 });
  });
});

app.post('/api/registerUser', async (req, res) => {
  const {roleID, firstName, lastName, hiredate, reportToID} = req.body;   
  const sql = `INSERT INTO User (roleID, firstName, lastName, hiredate, reportToID)     
  VALUES (?, ?, ?, ?, ?)   `;
  const values = [roleID || 4, firstName, lastName, hiredate || null, reportToID || null];
  db.query(sql, values, (err, result) => {     
  if (err) { 
    console.error('Error inserting User:', err);       
    return res.status(500).send('Error inserting User'); 
  } 
  
  const userID = result.insertId;
  res.status(201).send({userID}); 
  }); 
});

app.post('/api/registerAccount', async (req, res) => {
  const { userID, username, passwordHash } = req.body;

  // Proceed to insert the new account
  const sql = `INSERT INTO UserAccount (userID, username, passwordHash) VALUES (?, ?, sha2(?, 512))`;
  const values = [userID, username, passwordHash];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting UserAccount:', err);
      return res.status(500).json({ error: 'Error inserting UserAccount' });
    }
    res.status(201).json({ message: 'UserAccount created successfully' });
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
  const sql = 'SELECT A.animalID, A.name, A.species, A.location, A.statusID, S.name as status FROM Animal AS A JOIN Status AS S ON S.statusID = A.statusID ORDER BY S.name desc';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Animal table:', err);
      return res.status(500).send('Error querying the Animal table');
    }
    res.json(results);
  });
});

app.get('/api/getPlantList', (req, res) => {
  const sql = 'SELECT P.plantID, P.name, P.location, P.statusID, S.name AS status FROM Plant AS P JOIN Status AS S ON S.statusID = P.statusID ORDER BY S.name desc';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Plant table:', err);
      return res.status(500).send('Error querying the Plant table');
    }
    res.json(results);
  });
});

app.get('/api/getFarmConditions', (req, res) => {
  const sql = 'SELECT COUNT(P.plantID) AS count FROM AppleOrchardSystem.Plant AS P GROUP BY P.statusID UNION SELECT COUNT(A.animalID) AS count FROM Animal AS A GROUP BY A.statusID';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying conditions:', err);
      return res.status(500).send('Error querying the conditions');
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
      console.error('Error querying the Report table');
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


app.get('/api/getDiscounts', (req, res) => {
  const sql = 'SELECT discountID, code, name, percentOff, description, expireyDate, statusID FROM Discount WHERE statusID = 16';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Discount table:', err);
      return res.status(500).send('Error querying the Discount table');
    }
    res.json(results);
  });
});

app.put('/api/setDiscountStatus/:id', (req, res) => {
  const { id } = req.params;
  const { statusID } = req.body;
  const sql = 'UPDATE Discount SET statusID = ? WHERE discountID = ?';
  db.query(sql, [statusID, id], (err, results) => {
    if (err) {
      console.error('Error updating product:', err);
      return res.status(500).send('Error updating product');
    }
    res.sendStatus(200);
  });
});

app.get('/api/getNonActiveDiscounts', (req, res) => {
  const sql = 'SELECT discountID, code, name, percentOff, description, expireyDate, statusID FROM Discount WHERE statusID = 17';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Discount table:', err);
      return res.status(500).send('Error querying the Discount table');
    }
    res.json(results);
  });
});

//get Animals
app.get('/api/getNonActiveDiscounts', (req, res) => {
  const sql = 'SELECT discountID, code, name, percentOff, description, expireyDate, statusID FROM Discount WHERE statusID = 17';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the Discount table:', err);
      return res.status(500).send('Error querying the Discount table');
    }
    res.json(results);
  });
});

// Create a new discount
app.post('/api/createDiscount', (req, res) => {   
  const {code, name, description, percentOff, expireyDate } = req.body;   
  const sql = `INSERT INTO Discount (code, name, description, percentOff, expireyDate, statusID)     
  VALUES (?, ?, ?, ?, ?, 16)   `;     
  db.query(sql, [code, name, description, percentOff, expireyDate || null], (err, result) => {     
  if (err) { 
    console.error('Error inserting task:', err);       
    return res.status(500).send('Error inserting task'); 
  } 
  res.status(201).send('Task created successfully'); 
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
  const { date, userID, cart, paymentType, cardNumber, cardExpiration, cardCode, discount} = req.body;

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
    const insertTransactionItemSql = `INSERT INTO TransactionItem (transactionID, itemID, cartRentalID, unitPrice, quantity) VALUES ?`;

    const itemsToInsert = cart.map(item => [transactionID, item.itemID || null, item.cartRentalID || null, item.price, item.quantity]);

    db.query(insertTransactionItemSql, [itemsToInsert], (err) => {
      if (err) {
        console.error('Error inserting transaction items:', err);
      }
      res.status(201).json({ transactionID, message: 'Transaction created successfully' });
    });

    // Insert into the TransactionPayment table
    const insertTransactionPaymentSql = `INSERT INTO TransactionPayment (transactionID, paymentType, cardNumber, cardExpiration, cardCode, discountID) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(insertTransactionPaymentSql, [transactionID, paymentType, cardNumber || null, cardExpiration || null, cardCode || null, discount] , (err, result) => {
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
  const sql = 'SELECT userID, roleID, firstName, lastName FROM User';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error querying the User table:', err);
      return res.status(500).send('Error querying the User table');
    }
    res.json(results);
  });
});

app.post('/api/updateUserRole', (req, res) => {
  const { userID, roleID } = req.body;

  const sql = 'UPDATE User SET roleID = ? WHERE userID = ?';
  db.query(sql, [roleID, userID], (err, results) => {
    if (err) {
      console.error('Error updating user role:', err);
      return res.status(500).send('Error updating user role');
    }
    res.send('User role updated successfully');
  });
});

app.get('/api/employeesWithRoles', (req, res) => {
  const sql = `
    SELECT 
      userID AS id, 
      CONCAT(firstName, ' ', lastName) AS name 
    FROM User
    WHERE roleID IN (2, 3)
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send("An error occurred while fetching employees with specific roles");
    }
    res.json(results); // Return the list of filtered employees as JSON
  });
});


// Get Event List Endpoint
app.get('/api/getEventList', async (req, res) => {
  const { isPrivate } = req.query;
  let sql = 'SELECT eventID, scheduledDate, isPrivate, title, description FROM Event';

  const values = [];
  if (isPrivate) {
    sql += ' WHERE isPrivate = ?';
    values.push(isPrivate);
  }

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error querying the Event table:', err);
      return res.status(500).send('Error querying the Events table');
    }
    res.json(results);
  });
});

// Create event endpoint
app.post('/api/createEvent', async (req, res) => {
  const {scheduledDate, isPrivate, title, description} = req.body;
  const sql = `INSERT INTO Event (scheduledDate, isPrivate, title, description)     
  VALUES (?, ?, ?, ?)`;
  const values = [scheduledDate, isPrivate, title, description];
  db.query(sql, values, (err, result) => {     
  if (err) { 
    console.error('Error creating event:', err);       
    return res.status(500).send('Error creating event'); 
  } 
  res.status(201).send('Event created successfully'); 
  }); 
});
//Count Tasks by userID 
app.get('/api/assignedTaskCount/:userID', (req, res) => {
  const { userID } = req.params;
  const sql = 'SELECT COUNT(*) AS taskCount FROM AssignedTask WHERE userID = ? AND statusID = 3';
  db.query(sql, [userID], (err, results) => {
    if (err) {
      console.error('Error fetching task count:', err);
      return res.status(500).send('Error fetching task count');
    }
    res.json({ taskCount: results[0].taskCount });
  });
});


app.get('/', (req, res) => {
  res.send('API is running. Use /api/Item to fetch items and /api/UserAccount to handle login.');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${BACKEND_URL}:${PORT}`);
});
