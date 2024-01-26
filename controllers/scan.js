const axios = require('axios')
const isValidIP = require('is-my-ip-valid')()
const isValidEmail = require('email-validator')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const emailProviders = new Set(require('email-providers/all.json'))
const extractDomain = require('extract-domain')
const isValidDomain = require('is-valid-domain')

const config = require('../config/config.js')
const utility = require('../utility/utility.js')

/**
 * Begin the process of reading the specified domain's website to gather information about the company.
 * @param {string} domain - The website domain to gather information.
 */
exports.getRawPages = async function (req, res) {
  const domain = await extractDomain(req.params.domain.toLowerCase(), { tld: true })

  console.log('Get raw pages of ' + domain)

  utility.createLog('createOperation', 'businessImpact', {
    domain
  })

  if (isValidDomain(domain)) {
    try {
      const response = await axios({
        url: `${config.ip_feed}/cyb/getRawPages/${domain}`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })

      return res.json({
        rawPages: utility.cutString(response.data.rawPages)
      })
    } catch (error) {
      console.log(error.message)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

/**
 * Start the scansion of an ip address and return the result.
 * @param {string} ip - The ip address to scan.
 */
exports.scanIP = async function (req, res) {
  const ip = req.params.ip

  console.log('Scan IP ' + ip)

  utility.createLog('createOperation', 'scanIP', {
    ip
  })

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
      console.log(error.message)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(400)
  }
}

/**
 * Create an operation to scan a company external surface and send the operation code to the user.
 * @param {string} userEmail - The email address of the user.
 */
exports.scanCompany = async function (req, res) {
  const userEmail = req.query.userEmail.toLowerCase()

  console.log('Scan company ' + userEmail)

  utility.createLog('createOperation', 'scanCompany', {
    email: userEmail
  })

  if (userEmail) {
    if (isValidEmail.validate(userEmail) && !emailProviders.has(userEmail.split('@')[1])) {
      const operationCode = utility.getOperationCode()

      await utility.sendEmail(userEmail, operationCode)

      await utility.createOperation(operationCode, 'scanCompany', {
        companyName: utility.extractCompanyName(userEmail),
        userEmail
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
  } else {
    return res.sendStatus(400)
  }
}
