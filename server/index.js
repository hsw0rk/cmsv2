// Our dependencies
const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')

app.use(express.json())
app.use(cors())

// run the server
app.listen(3002, ()=>{
    console.log('Server is running on port 3002')
})

// Database connection
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'plantdb',
})

// register server
app.post('/register', (req, res)=>{
    // get variables from the form
    const sentEmail = req.body.Email
    const sentUserName = req.body.UserName
    const sentPassword = req.body.Password

    // Creating SQL statement to insert user to the database table users
    const SQL = `INSERT INTO Users (email, username, password) VALUES (?, ?, ?)`;
    const VALUES = [sentEmail, sentUserName, sentPassword]

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
    const sentLoginUserName = req.body.LoginUserName
    const sentLoginPassword = req.body.LoginPassword

    // Creating SQL statement to insert user to the database table users
    const SQL = `SELECT * FROM users WHERE username = ? && password = ?`;
    const VALUES = [sentLoginUserName, sentLoginPassword]

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