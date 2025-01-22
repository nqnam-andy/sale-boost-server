const express = require('express');
const {
  createOrReloadSite,
  updateAmount
} = require('../controllers/site.controller');

const router = express.Router();

router.post('/', createOrReloadSite);

router.patch('/:instanceId', updateAmount);

module.exports = router;
