const axios = require('axios')
const dayjs = require('dayjs')
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const config = require('../config/config.js')

/**
 * Get number of companies attacked by ransomware based on the parameters
 * @param {string} countryCode - The country code to filter.
 * @param {number} revenue - The revenue to filter.
 * @param {number} employees - The number of employees to filter.
 * @param {string} ransomwareGroup - The ransomware group to filter.
 * @param {string} startDate - The start date to filter.
 * @param {string} endDate - The end date to filter.
 * @param {string} naicsCode - The naics code to filter.
 */
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
  } else if (startDate && !dayjs(startDate, 'YYYY-MM-DD', true).isValid()) {
    validationParameters = false
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
