const express = require('express');
const connectDB = require('./config/db')
const app = express();

const PORT = process.env.PORT || 6005;

// connect db
connectDB();    

// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/auth', require('./routes/api/auth'))

app.listen(PORT, () => console.log(`Application running on ${PORT}`) );