const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//import routes
const authRoute = require('./routes/auth');

dotenv.config();

// Connect to DB
mongoose.connect(
process.env.DB_CONNECT,
{ useNewUrlParser: true, useUnifiedTopology: true },
() => console.log('connected to db'))

//Middleware
app.use(express.json());

//Route middlewares
app.use('/api/user', authRoute);

app.listen(3000, ()=> console.log('server up and running'));