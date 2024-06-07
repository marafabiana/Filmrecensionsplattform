// 1 Imports
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// 2 Run express on a variable called app 
const app = express();

// 10 Config JSON response
app.use(express.json());

// 3 Public Route
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the API!" })
});

// 8 Import userRoutes
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes')

// 9 Use userRoutes
app.use('/', userRoutes);
app.use('/', movieRoutes);
app.use('/', reviewRoutes)

// 5 Credentials and connect to mongoose
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose
.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.d1tfw6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => {
    // 3.1
    app.listen(3000)
    console.log('Connected to the database!');
})

.catch((err) => console.log(err));

// 4 Create a new project in MongoDB and put a username and password in the .env file
// 6 Create user.js
// 7 Create userRoutes.js