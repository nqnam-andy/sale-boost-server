const express = require('express');

const router = express.Router();

router.use('/site', require('./site.route'));
router.use('/webhook', require('./webhook.route'));
router.use('/packages', require('./package.route'));
router.use('/question-history', require('./questionHistory.route'));

module.exports = router;
