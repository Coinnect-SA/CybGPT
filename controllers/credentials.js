const isValidEmail = require('email-validator')

const utility = require('../utility/utility.js')

exports.checkEmailCredentials = async function (req, res) {
  const email = req.params.email

  console.log('Check email credentials of ' + email)

  if (isValidEmail.validate(email)) {
    const operationCode = getOperationCode()

    await utility.sendEmail(email, operationCode)

    await utility.createOperation(operationCode, 'checkEmailCredentials', {
      email
    })

    return res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
}
