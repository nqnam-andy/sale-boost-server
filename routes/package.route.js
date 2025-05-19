const express = require('express');
const { listPackages } = require('../controllers/package.controller');

const router = express.Router();

// API để lấy danh sách các gói
router.get('/', listPackages);

module.exports = router;