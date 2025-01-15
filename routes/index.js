const express = require('express');

const router = express.Router();

router.use('/cascade', require('./webhook.route'));

module.exports = router;