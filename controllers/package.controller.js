const Package = require('../models/package.model')

// Hàm để lấy danh sách các gói
exports.listPackages = async (req, res) => {
  try {
    const packages = await Package.find() // Lấy tất cả các gói
    res.status(200).json(packages)
  } catch (error) {
    console.error('Error fetching packages:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
