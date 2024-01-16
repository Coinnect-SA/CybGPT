const axios = require('axios')
const isValidIP = require('is-my-ip-valid')()
const isValidEmail = require('email-validator')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const emailProviders = new Set(require('email-providers/all.json'))

const config = require('../config/config.js')
const utility = require('../utility/utility.js')

/**
 * Handles the process of validating parameters for a user's email and language.
 * Checks if the email is valid, not from a restricted provider, and the language is within acceptable limits.
 * @param {string} userEmail - The email address to be validated.
 * @param {string} language - The language parameter to be validated.
 * @returns {boolean} isValid - A boolean indicating whether the parameters passed validation.
 */
function validateParameters(userEmail, language) {
  if (!isValidEmail.validate(userEmail) || emailProviders.has(userEmail.split('@')[1]) || language.length > 2) {
    return false
  }
  return true
}

/**
 * Handles the process of making an Axios request to a specified URL with the given method and headers,
 * while incorporating error handling.
 * @param {string} url - The URL to make the Axios request to.
 * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST').
 * @param {Object} headers - The headers to be included in the request.
 * @returns {Promise} Promise - A promise that resolves to the data returned from the Axios request.
 * @throws {Error} error - An error object thrown in case of an unsuccessful Axios request.
 */
async function makeAxiosRequest(url, method, headers) {
  try {
    const response = await axios({ url, method, headers })
    return response.data
  } catch (error) {
    console.log(error)
    // Re-throw the error for handling at a higher level
    throw error
  }
}

/**
 * Handles the process of initiating a new operation for a user's email.
 * This function generates a unique operation code, sends it to the user via email, 
 * and creates an associated operation entry.
 * @param {string} userEmail - The email address for which the operation is being initiated.
 * @param {string} operationType - The type of operation to be created (e.g., 'getRawPages').
 * @param {string} [language=null] - An optional parameter for specifying language for localization.
 * @returns {string} operationCode - The generated operation code linked to the initiated operation.
 */
async function handleEmailAndOperation(userEmail, operationType, language = null) {
  const operationCode = utility.getOperationCode()

  await utility.sendEmail(userEmail, operationCode)

  const operationData = language
    ? { companyName: utility.extractCompanyName(userEmail), userEmail, language }
    : { email: userEmail }

  await utility.createOperation(operationCode, operationType, operationData)

  return operationCode
}

/**
 * Create a new operation to get the raw pages of the email domain and send the operation code to the user.
 * @param {string} email - The email address to extrract the domain from.
 */
exports.getRawPages = async function (req, res) {
  const email = req.params.email

  console.log('Get raw pages of ' + email)

  if (isValidEmail.validate(email) && !emailProviders.has(email.split('@')[1])) {
    try {
      const operationCode = await handleEmailAndOperation(email, 'getRawPages')
      return res.json({
        operationResult: 'The request has been sent. Please check your email for the operation code to insert in the chat.'
      })
    } catch (error) {
      console.log('500')
      return res.sendStatus(500)
    }
  } else {
    console.log('422')
    return res.json({
      operationResult: 'Please check the parameters. The email must be a valid business email address.'
    })
  }
}

/**
 * Start the scansion of an ip address and return the result.
 * @param {string} ip - The ip address to scan.
 */
exports.scanIP = async function (req, res) {
  const ip = req.params.ip

  console.log('Scan IP ' + ip)

  if (isValidIP(ip)) {
    const url = `${config.ip_feed}/cyb/scanIP/${ip}`
    const method = 'get'
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }

    try {
      const responseData = await makeAxiosRequest(url, method, headers)
      return res.json(responseData)
    } catch (error) {
      console.log('500')
      return res.sendStatus(500)
    }
  } else {
    console.log('400')
    return res.sendStatus(400)
  }
}

/**
 * Create an operation to scan a company external surface and send the operation code to the user.
 * @param {string} userEmail - The email address of the user.
 * @param {string} language - The language of the report.
 */
exports.scanCompany = async function (req, res) {
  const userEmail = req.query.userEmail
  const language = req.query.language

  console.log('Scan company ' + userEmail + ' ' + language)

  if (userEmail && language && validateParameters(userEmail, language)) {
    try {
      const operationCode = await handleEmailAndOperation(userEmail, 'scanCompany', language)
      return res.json({
        operationResult: 'The request has been sent. Please check your email for the operation code to insert in the chat.'
      })
    } catch (error) {
      console.log('500')
      return res.sendStatus(500)
    }
  } else {
    console.log('400')
    return res.sendStatus(400)
  }
}
