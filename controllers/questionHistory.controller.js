const QuestionHistory = require('../models/questionHistory.model')

// API lưu câu hỏi và trả lời
exports.saveQuestionAnswer = async (req, res) => {
  try {
    const { siteId, question, answer } = req.body

    if (!siteId || !question || !answer) {
      return res.status(400).json({ message: 'siteId, question, and answer are required.' })
    }

    const newEntry = new QuestionHistory({ siteId, question, answer })
    await newEntry.save()

    res.status(201).json({ message: 'Question and answer saved successfully.', data: newEntry })
  } catch (error) {
    console.error('Error saving question and answer:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}

// API lấy lịch sử câu hỏi và trả lời với phân trang
exports.getQuestionHistory = async (req, res) => {
  try {
    const { siteId } = req.params
    const { page = 1, limit = 20 } = req.query // Mặc định mỗi trang 20 bản ghi

    if (!siteId) {
      return res.status(400).json({ message: 'siteId is required.' })
    }

    const skip = (page - 1) * limit

    const history = await QuestionHistory.find({ siteId })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian mới nhất
      .skip(skip)
      .limit(parseInt(limit))

    const total = await QuestionHistory.countDocuments({ siteId })

    res.status(200).json({
      data: history,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching question history:', error)
    res.status(500).json({ message: 'Internal server error.' })
  }
}
