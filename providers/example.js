const config = require('../config/config.js')
const virustotalApiKey = process.env.VIRUSTOTAL_APY_KEY || config.virustotal_api_key
const axios = require('axios')
const dayjs = require('dayjs')
const isValidDomain = require('is-valid-domain')

/**
 * Retrieves a list of files that have been communicating with a specified domain.
 *
 * This function queries the VirusTotal API to find files that have communicated with
 * a given domain. It validates the domain and then sends a GET request to the
 * VirusTotal API. The response includes details of each file such as name, type,
 * category, threat level, SHA256 hash, and the date of the first submission for scanning.
 * If an error occurs during the API request, the function throws an error.
 *
 * @param {string} domain - The domain to check for communicating files.
 *
 * @throws {Error} If the 'domain' is undefined, not a valid domain or if the API request
 *         fails.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of objects, where
 *          each object contains details about a file communicating with the domain. The
 *          structure of each file object is:
 *          {
 *            name: String, // Meaningful name of the file
 *            type: String, // Type description of the file
 *            category: String, // Suggested threat label for the file
 *            threat: String, // Popular threat category
 *            sha256: String, // SHA256 hash of the file
 *            scanned: Date // Date of first submission for scanning (if available)
 *          }
 *
 * @example
 * // Example usage
 * communicatingFilesExample('example.com')
 *   .then(files => console.log(files))
 *   .catch(error => console.error(error));
 */
exports.communicatingFilesExample = async function communicatingFilesExample (domain) {
  if (!domain || !isValidDomain(domain)) throw new Error('Undefined domain')

  let response = {}
  try {
    response = await axios({
      url: 'https://www.virustotal.com/api/v3/domains/' + domain + '/communicating_files',
      method: 'get',
      headers: {
        'x-apikey': virustotalApiKey,
        Accept: 'application/json'
      }
    })
  } catch (error) {
    if (error?.response?.data) {
      throw new Error(error.response.data.error + ' ' + error.response.data.message)
    } else {
      throw new Error('Internal Server Error')
    }
  }

  const commFiles = []
  for (const finding of response.data) {
    commFiles.push({
      name: finding.attributes?.meaningful_name,
      type: finding.attributes?.type_description,
      category: finding.attributes?.popular_threat_classification?.suggested_threat_label,
      threat: finding.attributes?.popular_threat_classification?.popular_threat_category[0].value,
      sha256: finding.attributes?.sha256,
      scanned: finding.attributes?.first_submission_date ? dayjs.unix(finding.attributes.first_submission_date) : null
    })
  }

  return commFiles
}
