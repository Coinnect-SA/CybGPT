const apiClient = require('../utility/apiClient')
const isValidEmail = require('email-validator')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const emailProviders = new Set(require('email-providers/all.json'))
const extractDomain = require('extract-domain')
const isValidDomain = require('is-valid-domain')

const utility = require('../utility/utility.js')
const { IpAddressType } = require('../types/zodTypes.js')

/**
 * Handles the process of making an Axios request to a specified URL with the given method,
 * while incorporating error handling.
 * @param {string} url - The URL to make the Axios request to.
 * @param {string} method - The HTTP method for the request (e.g., 'GET', 'POST').
 * @returns {Promise} Promise - A promise that resolves to the data returned from the Axios request.
 * @throws {Error} error - An error object thrown in case of an unsuccessful Axios request.
 */
async function makeAxiosRequest(path, method) {
  try {
    const response = await apiClient({ url: path, method })
    return response.data
  } catch (error) {
    console.log(error.message)
    // Re-throw the error for handling at a higher level
    throw error
  }
}

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
    const url = `/cyb/getRawPages/${domain}`
    const method = 'get'
    try {
      const responseData = await makeAxiosRequest(url, method)
      return res.json(utility.cutString(responseData.rawPages))
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
  const parsedInput = IpAddressType.safeParse(req.params.ip)
  if (!parsedInput.success) {
    return res.sendStatus(400)
  }

  const ip = parsedInput.data

  console.log('Scan IP ' + ip)

  utility.createLog('createOperation', 'scanIP', {
    ip
  })

  const url = `/cyb/scanIP/${ip}`
  const method = 'get'
  try {
    const responseData = await makeAxiosRequest(url, method)
    return res.json(responseData)
  } catch (error) {
    if (error.response?.status === 404) {
      res.json({
        message: 'Unfortunately, we were unable to find any results for the IP address you provided.'
      })
    } else
      return res.sendStatus(error.response?.status || 500)
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

  if (userEmail && isValidEmail.validate(userEmail) && !emailProviders.has(userEmail.split('@')[1])) {
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
}
