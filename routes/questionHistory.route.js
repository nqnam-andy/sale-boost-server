const express = require('express');
const { saveQuestionAnswer, getQuestionHistory } = require('../controllers/questionHistory.controller');

const router = express.Router();

// API lưu câu hỏi và trả lời
router.post('/', saveQuestionAnswer);

// API lấy lịch sử câu hỏi và trả lời với phân trang
router.get('/:siteId', getQuestionHistory);

module.exports = router;