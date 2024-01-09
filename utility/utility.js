const axios = require('axios')
const generator = require('generate-password')

const config = require('../config/config.js')
const { CybOperation } = require('../models/mongodb')

exports.cutString = function cutString (inputString) {
  let cuttedString = inputString
  if (inputString.length > 90000) {
    cuttedString = inputString.substring(0, 90000)
  }
  return cuttedString
}

exports.getOperationCode = function getOperationCode () {
  return generator.generate({
    length: 6,
    numbers: true,
    uppercase: false,
    excludeSimilarCharacters: true
  })
}

exports.sendEmail = async function sendEmail (email, operationCode) {
  await axios({
    url: `${config.ip_feed}/email/send`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    data: {
      action: 'cyb-operation',
      email,
      operationCode
    }
  })
}

exports.createOperation = async function createOperation (operationCode, type, params) {
  await CybOperation.create({
    code: operationCode,
    type,
    done: false,
    params,
    createdAt: new Date()
  })
}

exports.extractCompanyName = function extractCompanyName (email) {
  let name = email.split('@')[1]
  name = name.substring(0, name.lastIndexOf('.'))
  return name.charAt(0).toUpperCase() + name.slice(1)
}
