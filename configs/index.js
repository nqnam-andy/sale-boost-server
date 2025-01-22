require('dotenv').config();

module.exports = {
  db: {
    uri: process.env.MONGO_URI,
  },
  server: {
    port: process.env.PORT || 3000,
  },
  webhook: {
    public_key: process.env.PUBLIC_KEY,
    type: 'order'
  },
  data: {
    default_amount_action: 20
  },
  hooks: {
    name: 'slack'
  }
}