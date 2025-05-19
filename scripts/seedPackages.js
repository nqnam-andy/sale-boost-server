const Package = require('../models/package.model')
const mongoose = require('mongoose')
const { db } = require('../configs')
const packagesData = require('../dataPackages.json')

const MONGO_URI = db.uri

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1) // Thoát nếu không kết nối được
  })

// Thêm dữ liệu vào bảng Package
async function seedPackages() {
  try {
    await Package.deleteMany() // Xóa tất cả bản ghi cũ (nếu cần)
    await Package.insertMany(packagesData)
    console.log('Packages seeded successfully!')
  } catch (err) {
    console.error('Error seeding packages:', err)
  } finally {
    mongoose.disconnect() // Đóng kết nối sau khi hoàn thành
  }
}

seedPackages()
