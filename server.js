const express = require('express');
const connectDB = require('./config/db');

const app = express();

// connect db
connectDB();

// bodyparser for request and body validation
app.use(express.json({ extended: false }));

// Define Routes
app.use('/admin', require('./admin/adminDashboard'));
app.use('/api/user', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profileRouter'));

const PORT = process.env.PORT || 6005;
app.listen(PORT, () => console.log(`Application running on ${PORT}`));
