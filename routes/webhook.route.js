const express = require('express');
const {
  createProductWebhook,
} = require('../controllers/webhook.controller');

const router = express.Router();

router.post('/order/created', express.text(), orderCreatedWebhook);
router.post('/order/canceled', express.text(), );
router.post('/order/purchased', express.text(), createProductWebhook);

module.exports = router;
