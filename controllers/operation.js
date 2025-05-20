const apiClient = require('../utility/apiClient')
const dayjs = require('dayjs')
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
    done: false,
    createdAt: {
      $gte: dayjs().subtract(3, 'day').toDate()
    }
  })

  if (operation) {
    let response

    try {
      switch (operation.type) {
        case 'checkEmailCredentials':
          console.log('checkEmailCredentials')
          ({ data: response } = await apiClient.get(`/cyb/checkEmailCredentials/${operation.params.email}`))
          break
        case 'scanCompany':
          console.log('scanCompany')
          ({ data: response } = await apiClient.post('/cyb/scanCompany', {
            mainDomain: operation.params.userEmail.split('@')[1],
            companyName: operation.params.companyName,
            userEmail: operation.params.userEmail
          }))
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
