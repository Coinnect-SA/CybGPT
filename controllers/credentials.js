const { EmailType } = require('../types/zodTypes.js')
const utility = require('../utility/utility.js')

/**
 * Create a new operation to check the credentials of an email address and send the operation code to the user.
 * @param {string} email - The email address to check.
 */

exports.checkEmailCredentials = async function (req, res) {
  const paresedInput = EmailType.safeParse(req.params.email)
  if (!paresedInput) {
    return res.status(400).json({
      msg: 'email type is not valid'
    })
  }
  const email = paresedInput.data.email

  console.log('Check email credentials of ' + email)

  utility.createLog('createOperation', 'checkEmailCredentials', {
    email
  })

  const operationCode = utility.getOperationCode()

  await utility.sendEmail(email, operationCode)

  await utility.createOperation(operationCode, 'checkEmailCredentials', {
    email
  })

  return res.sendStatus(200)
}
