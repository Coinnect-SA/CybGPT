const axios = require('axios')
const config = require('../config/config.js')

const apiClient = axios.create({
  baseURL: config.ip_manager,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

module.exports = apiClient
