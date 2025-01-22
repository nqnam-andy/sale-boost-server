const express = require('express');
const {
  orderCreatedWebhook,
  orderCanceledWebhook,
  settingsWebhook,
  getOrders
} = require('../controllers/webhook.controller');

const router = express.Router();

router.post('/order/created', express.text(), orderCreatedWebhook);
router.post('/order/canceled', express.text(), orderCanceledWebhook);

router.post('/order/settings', settingsWebhook);

router.get('/orders/:instanceId', getOrders);

module.exports = router;
