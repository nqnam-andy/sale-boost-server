const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.route');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users', userRoutes);

app.set('view engine', 'ejs');
app.set('views', './views');

// Route render trang Privacy Policy
app.get('/privacy', (req, res) => {
  res.render('privacy-policy');
});

// Database Connection
mongoose.connect(MONGO_URI,)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
