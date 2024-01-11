const axios = require('axios');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const config = require('../config/config.js');

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

/**
 * Middleware for request parameters validation
 * Validates various parameters extracted from the request query string.
 * Responds with a 400 status and an error message if validation fails.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function validateRequestParams(req, res, next) {
  const {
    countryCode,
    revenue,
    employees,
    ransomwareGroup,
    startDate,
    endDate,
    naicsCode,
  } = req.query;

  if (
    (countryCode && countryCode.length > 2) ||
    (ransomwareGroup && ransomwareGroup.length >= 30) ||
    (revenue && (isNaN(revenue) || parseInt(revenue) < 0)) ||
    (employees && (isNaN(employees) || parseInt(employees) < 0)) ||
    (startDate && !dayjs(startDate, 'YYYY-MM-DD', true).isValid()) ||
    (endDate && !dayjs(endDate, 'YYYY-MM-DD', true).isValid()) ||
    (naicsCode &&
      (isNaN(naicsCode) || naicsCode.length < 2 || parseInt(naicsCode) < 0))
  ) {
    return res.status(400).json({ error: 'Invalid request parameters.' });
  }

  // If naicsCode is provided, extract the first two characters
  req.correctNaicsCode = naicsCode ? naicsCode.substring(0, 2) : undefined;
  next();
}

/**
 * Get ransomware statistics based on parameters
 * Makes a POST request to an external API to fetch ransomware statistics.
 * Uses the validation middleware before processing the actual logic.
 * Responds with the fetched data or a 500 status in case of an error.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRansomwareStats = async function (req, res) {
  const {
    countryCode,
    revenue,
    employees,
    ransomwareGroup,
    startDate,
    endDate,
    correctNaicsCode,
  } = req.query;

  try {
    const response = await axios.post(`${config.ip_feed}/cyb/getRansomwareStats`, {
      countryCode,
      revenue,
      employees,
      ransomwareGroup,
      startDate,
      endDate,
      naicsCode: correctNaicsCode,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Respond with the fetched data
    return res.json(response.data);
  } catch (error) {
    // Log the error and respond with a 500 status in case of an error
    console.error(error);
    return res.sendStatus(500);
  }
};

// Use the validation middleware for the route
exports.getRansomwareStats = [validateRequestParams, exports.getRansomwareStats];