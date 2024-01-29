const mongoose = require('mongoose')
const config = require('../config/config.js')
const ApiUserSchema = require('./api_user')
const cybOperationSchema = require('./cyb_operation.js')
const cybLogSchema = require('./cyb_log.js')

const mongoConnectionType = process.env.MONGO_CONNECTION_TYPE || config.mongo_connection_type
const ipDb = process.env.IP_DB || config.ip_db
const nameDb = process.env.NAME_DB || config.name_db
let uri = mongoConnectionType + '://'
const options = {
  retryWrites: 'true',
  w: 'majority',
  maxPoolSize: 500
}

if (process.env.NODE_ENV === 'production') {
  uri = uri + ipDb + '/' + nameDb
  options.authSource = '$external'
  options.authMechanism = 'MONGODB-AWS'
} else {
  const userDb = process.env.USER_DB_MONGOOSE || config.user_db

  uri = uri + userDb + ipDb + '/' + nameDb
}

mongoose.connect(uri, options)
  .catch(error => function () {
    console.error(error)
  })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('disconnected', console.error.bind(console, 'connection lost:'))

const ApiUser = mongoose.model('Api_User', ApiUserSchema(mongoose))
const CybOperation = mongoose.model('Cyb_Operation', cybOperationSchema(mongoose))
const CybLog = mongoose.model('Cyb_Log', cybLogSchema(mongoose))

module.exports = {
  mongoose,
  ApiUser,
  CybOperation,
  CybLog
}
