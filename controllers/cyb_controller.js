const axios = require('axios')
const isValidIP = require('is-my-ip-valid')()
const isValidEmail = require('email-validator')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const emailProviders = new Set(require('email-providers/all.json'))
const generator = require('generate-password')

const config = require('../config/config.js')
const { CybOperation } = require('../models/mongodb')

exports.doOperation = async function (req, res) {
  const operationCode = req.params.operationCode

  console.log('doOperation ' + operationCode)

  const operation = await CybOperation.findOne({
    code: operationCode,
    done: false
  })

  if (operation) {
    let response

    switch (operation.type) {
      case 'getRawPages':
        console.log('getRawPages')
        response = await axios({
          url: `${config.ip_feed}/cyb/getRawPages/${operation.params.email.split('@')[1]}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })

        response = {
          rawPages: cutString(response.data.rawPages)
        }
        break
      case 'checkEmailCredentials':
        console.log('checkEmailCredentials')
        response = await axios({
          url: `${config.ip_feed}/cyb/checkEmailCredentials/${operation.params.email}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        })

        response = response.data
        break
      case 'scanCompany':
        console.log('scanCompany')
        response = await axios({
          url: `${config.ip_feed}/cyb/scanCompany`,
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          data: {
            mainDomain: operation.params.userEmail.split('@')[1],
            companyName: operation.params.companyName,
            userEmail: operation.params.userEmail,
            language: operation.params.language
          }
        })

        response = response.data
        break
    }

    operation.done = true
    await operation.save()

    return res.json(response)
  } else {
    console.log('404')
    return res.sendStatus(404)
  }
}

exports.getRawPages = async function (req, res) {
  const email = req.params.email

  console.log('Get raw pages of ' + email)

  if (isValidEmail.validate(email) && !emailProviders.has(email.split('@')[1])) {
    const operationCode = getOperationCode()

    await sendEmail(email, operationCode)

    await createOperation(operationCode, 'getRawPages', {
      email
    })

    return res.json({
      operationResult: 'The request has been sent. Please check your email for the operation code to insert in the chat.'
    })
  } else {
    console.log('422')
    return res.json({
      operationResult: 'Please check the parameters. The email must be a valid business email address.'
    })
  }
}

exports.scanIP = async function (req, res) {
  const ip = req.params.ip

  console.log('Scan IP ' + ip)

  if (isValidIP(ip)) {
    try {
      const response = await axios({
        url: `${config.ip_feed}/cyb/scanIP/${ip}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      res.json(response.data)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

exports.checkEmailCredentials = async function (req, res) {
  const email = req.params.email

  console.log('Check email credentials of ' + email)

  if (isValidEmail.validate(email)) {
    const operationCode = getOperationCode()

    await sendEmail(email, operationCode)

    await createOperation(operationCode, 'checkEmailCredentials', {
      email
    })

    return res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}

exports.getRansomwareStats = async function (req, res) {
  const countryCode = req.query.countryCode
  const revenue = req.query.revenue
  const employees = req.query.employees
  const ransomwareGroup = req.query.ransomwareGroup
  const startDate = req.query.startDate
  const endDate = req.query.endDate
  const naicsCode = req.query.naicsCode
  let validationParameters = true

  console.log('Get ransomware stats of ' + countryCode + ' ' + revenue + ' ' + employees + ' ' + ransomwareGroup + ' ' + startDate + ' ' + endDate + ' ' + naicsCode)

  if (countryCode && countryCode.length > 2) {
    validationParameters = false
  } else if (ransomwareGroup && ransomwareGroup.length >= 30) {
    validationParameters = false
  } else if (revenue && (isNaN(revenue) || parseInt(revenue) < 0)) {
    validationParameters = false
  } else if (employees && (isNaN(employees) || parseInt(employees) < 0)) {
    validationParameters = false
    // } else if (startDate && isNaN(Date.parse(startDate))) {
  } else if (startDate && !dayjs(startDate, 'YYYY-MM-DD', true).isValid()) {
    validationParameters = false
    // } else if (endDate && isNaN(Date.parse(endDate))) {
  } else if (endDate && !dayjs(endDate, 'YYYY-MM-DD', true).isValid()) {
    validationParameters = false
  } else if (naicsCode && (isNaN(naicsCode) || naicsCode.length < 2 || parseInt(naicsCode) < 0)) {
    validationParameters = false
  }

  let correctNaicsCode
  if (naicsCode && validationParameters === true) {
    correctNaicsCode = naicsCode.substring(0, 2)
  }

  if (validationParameters) {
    try {
      const response = await axios({
        url: `${config.ip_feed}/cyb/getRansomwareStats`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        data: {
          countryCode,
          revenue,
          employees,
          ransomwareGroup,
          startDate,
          endDate,
          naicsCode: correctNaicsCode
        }
      })
      return res.json(response.data)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  } else {
    return res.sendStatus(400)
  }
}

exports.scanCompany = async function (req, res) {
  const userEmail = req.query.userEmail
  const language = req.query.language

  console.log('Scan company ' + userEmail + ' ' + language)

  let validationParameters = true
  if (userEmail && language) {
    if (!isValidEmail.validate(userEmail) || emailProviders.has(userEmail.split('@')[1])) {
      validationParameters = false
    } else if (language.length > 2) {
      validationParameters = false
    }

    if (validationParameters) {
      const operationCode = getOperationCode()

      await sendEmail(userEmail, operationCode)

      await createOperation(operationCode, 'scanCompany', {
        companyName: extractCompanyName(userEmail),
        userEmail,
        language
      })

      return res.json({
        operationResult: 'The request has been sent. Please check your email for the operation code to insert in the chat.'
      })
    } else {
      console.log('422')
      return res.json({
        operationResult: 'Please check the parameters. The email must be a valid business email address and you must specify the language for the report.'
      })
    }
  } else {
    return res.sendStatus(400)
  }
}

function cutString (inputString) {
  let cuttedString = inputString
  if (inputString.length > 90000) {
    cuttedString = inputString.substring(0, 90000)
  }
  return cuttedString
}

function getOperationCode () {
  return generator.generate({
    length: 6,
    numbers: true,
    uppercase: false,
    excludeSimilarCharacters: true
  })
}

async function sendEmail (email, operationCode) {
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

async function createOperation (operationCode, type, params) {
  await CybOperation.create({
    code: operationCode,
    type,
    done: false,
    params,
    createdAt: new Date()
  })
}

function extractCompanyName (email) {
  let name = email.split('@')[1]
  name = name.substring(0, name.lastIndexOf('.'))
  return name.charAt(0).toUpperCase() + name.slice(1)
}
