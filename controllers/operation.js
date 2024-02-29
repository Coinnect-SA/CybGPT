const axios = require('axios')

const config = require('../config/config.js')
const { CybOperation } = require('../models/mongodb')

/**
 * Retrieve the operation from the database and call internal server to execute it. Then set the operation as done.
 * @param {string} operationCode - The operation code.
 */

exports.doOperation = async function (req, res) {
  const operationCode = req.params.operationCode

  console.log('doOperation ' + operationCode)

  const operation = await CybOperation.findOne({
    code: operationCode,
    done: false
  })

  if (operation) {
    let response

    try {
      switch (operation.type) {
        case 'checkEmailCredentials':
          console.log('checkEmailCredentials')
          response = await axios({
            url: `${config.ip_manager}/cyb/checkEmailCredentials/${operation.params.email}`,
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
            url: `${config.ip_manager}/cyb/scanCompany`,
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            data: {
              mainDomain: operation.params.userEmail.split('@')[1],
              companyName: operation.params.companyName,
              userEmail: operation.params.userEmail
            }
          })

          response = response.data
          break
      }

      operation.done = true
      await operation.save()

      return res.json(response)
    } catch (error) {
      console.log(error.message)
      return res.sendStatus(500)
    }
  } else {
    console.log('404')
    return res.sendStatus(404)
  }
}
