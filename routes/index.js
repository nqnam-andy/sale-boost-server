const express = require('express');

const router = express.Router();

router.use('/site', require('./site.route'));
router.use('/webhook', require('./webhook.route'));

module.exports = router;