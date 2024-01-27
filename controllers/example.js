const isValidDomain = require('is-valid-domain')
const exampleProvider = require('../providers/example')

exports.communicatingFilesExample = async function (req, res) {
  const domain = req.params.domain.toLowerCase()

  console.log('Communicating Files Example of ' + domain)

  if (isValidDomain(domain)) {
    try {
      const response = await exampleProvider.communicatingFilesExample(domain)

      return res.json(response)
    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
    }
  } else {
    return res.sendStatus(400)
  }
}
