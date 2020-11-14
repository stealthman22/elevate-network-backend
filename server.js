const express = require('express');
const connectDB = require('./config/db')
const app = express();



// connect db
connectDB();    

// bodyparser for request and body validation
app.use(express.json({extended: false}))

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/menteeProfile', require('./routes/api/menteeProfile'));



const PORT = process.env.PORT || 6005;
app.listen(PORT, () => console.log(`Application running on ${PORT}`) );