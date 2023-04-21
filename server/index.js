// Our dependencies
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const { body, validationResult } = require('express-validator');
require('dotenv').config();

app.use(express.json())
app.use(cors())

// Database connection
const pool = mysql.createPool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

// run the server
app.listen(3002, ()=>{
    console.log('Server is running on port 3002')
})

// register server
app.post('/register', [
    // Input validation
    body('Employeecode').isLength({ min: 1 }),
    body('Employeename').isLength({ min: 1 }),
    body('Password').isLength({ min: 1 })
], (req, res)=>{
    // Check if input validation failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // get variables from the form
    const sentEmployeecode = req.body.Employeecode
    const sentEmployeename = req.body.Employeename
    const sentPassword = req.body.Password

    // Creating SQL statement to insert user to the database table users
    const SQL = `INSERT INTO employeemaster (employeecode, employeename, password) VALUES (?, ?, ?)`;
    const VALUES = [sentEmployeecode, sentEmployeename, sentPassword]

    // Query to execute the sql statement stated above
    pool.query(SQL, VALUES, (err, results)=>{
        if(err){
            res.status(500).send({error: "Error inserting user"});
        }
        else{
            console.log('User inserted successfully!')
            res.send({message: 'User added!'})
        }
    })
})

// login with these credentials from a registered user
app.post('/login', [
    // Input validation
    body('LoginEmployeecode').isLength({ min: 1 }),
    body('LoginPassword').isLength({ min: 1 })
], (req, res)=>{
    // Check if input validation failed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    // get variables from the form
    const sentLoginEmployeecode = req.body.LoginEmployeecode
    const sentLoginPassword = req.body.LoginPassword

    // Creating SQL statement to insert user to the database table users
    const SQL = `SELECT * FROM employeemaster WHERE employeecode = ? && password = ?`;
    const VALUES = [sentLoginEmployeecode, sentLoginPassword]

    // Query to execute the sql statement stated above
    pool.query(SQL, VALUES, (err, results)=>{
        if(err){
            res.status(500).send({error: "Error logging in"});
        }
        if(results.length > 0){
            res.send(results)
        }
        else{
            res.status(401).send({message: `Credentials don't match`})
        }
    })    
})

app.post('/investments', (req, res) => {
    // extract data from request body
    const {
      name,
      product,
      principal,
      customername,
      pan,
      mobileno,
      creditbranch,
      business,
      vertical,
      employeename,
      employeecode
    } = req.body;
  
    // validate input data to prevent SQL injection attacks
    const invalidInputs = [name, product, principal, customername, pan, mobileno, creditbranch, business, vertical, employeename, employeecode].some(input => !input || typeof input !== 'string');
    if (invalidInputs) {
      res.status(400).send({ message: 'Invalid input data' });
      return;
    }
  
    // create MySQL query using prepared statement to insert data into cmsverticalform table
    const SQL = `INSERT INTO cmsverticalform
                    (name, product, principal, customername, pan, mobileno, creditbranch, business, vertical, employeename, employeecode)
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    // execute MySQL query using connection pool and prepared statement
    pool.getConnection((err, connection) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to connect to database' });
        return;
      }
  
      connection.query(SQL, [
        name,
        product,
        principal,
        customername,
        pan,
        mobileno,
        creditbranch,
        business,
        vertical,
        employeename,
        employeecode
      ], (err, results) => {
        connection.release(); // release connection back to pool
  
        if (err) {
          console.error(err);
          res.status(500).send({ message: 'Failed to insert data' });
          return;
        }
  
        console.log('Inserted successfully!');
        res.send({ message: 'Data added successfully' });
      });
    });
  });

