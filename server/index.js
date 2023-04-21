// Our dependencies
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config();


app.use(express.json())
app.use(cors())

// run the server
app.listen(3002, ()=>{
    console.log('Server is running on port 3002')
})

// Database connection
const db = mysql.createConnection({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

// register server
app.post('/register', (req, res)=>{
  // get variables from the form
    const sentEmployeecode = req.body.Employeecode
    const sentEmployeename = req.body.Employeename
    const sentPassword = req.body.Password

    // Creating SQL statement to insert user to the database table users
  const SQL = `INSERT INTO employeemaster (employeecode, employeename, password) VALUES (?, ?, ?)`;
    const VALUES = [sentEmployeecode, sentEmployeename, sentPassword]

    // Query to execute the sql statement stated above
    db.query(SQL, VALUES, (err, results)=>{
        if(err){
            res.send(err)
    }
        else{
            console.log('User inserted successfully!')
            res.send({message: 'User added!'})
        }
    })
})

// login with these credentials from a registered user
app.post('/login', (req, res)=>{
  // get variables from the form
    const sentLoginEmployeecode = req.body.LoginEmployeecode
    const sentLoginPassword = req.body.LoginPassword

    // Creating SQL statement to insert user to the database table users
    const SQL = `SELECT * FROM employeemaster WHERE employeecode = ? && password = ?`;
    const VALUES = [sentLoginEmployeecode, sentLoginPassword]

    // Query to execute the sql statement stated above
    db.query(SQL, VALUES, (err, results)=>{
        if(err){
            res.send({error: err})
    }
        if(results.length > 0){
            res.send(results)
    }
        else{
            res.send({message: `Credentials don't match`})
        }
    })    
})

// handle POST request from investments.jsx form
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

  // create MySQL query to insert data into cmsverticalform table
  const SQL = `INSERT INTO cmsverticalform
                  (name, product, principal, customername, pan, mobileno, creditbranch, business, vertical, employeename, employeecode)
                  VALUES
                  (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const VALUES = [
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
        employeecode]              

  // execute MySQL query using connection pool
    db.query(SQL, VALUES, (err, results)=>{
        if(err){
            res.send(err)
    }
        else{
            console.log('Inserted successfully!')
            res.send({message: 'info added!'})
        }
    })
  });