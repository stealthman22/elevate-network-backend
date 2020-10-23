const express = require('express');
const connectDB = require('./config/db')
const app = express();

const PORT = process.env.PORT || 6005;

// connect db
connectDB();

app.listen(PORT, () => console.log(`Application running on ${PORT}`) );