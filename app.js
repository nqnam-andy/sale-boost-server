const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { db, server } = require('./configs');

const app = express();
const PORT = server.port;
const MONGO_URI = db.uri;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api', require('./routes'));

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
