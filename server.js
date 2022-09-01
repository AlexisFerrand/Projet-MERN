const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');
//Permet d'aller chercher les données dans le .env grâce à dotenv
require('dotenv').config({path: './config/.env'})
require('./config/db');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routes
app.use('/api/user', userRoutes);

// server
app.listen(process.env.PORT, ()=> {
    console.log(`Listening on port ${process.env.PORT}`)
})