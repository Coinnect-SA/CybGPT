const isValidDomain = require('is-valid-domain')
const exampleProvider = require('../providers/example')
const { DomainType } = require('../types/zodTypes.js')
exports.communicatingFilesExample = async function (req, res) {

  const paresedInput = DomainType.safeParse(req.params.domain);
  if (!paresedInput) {
    return res.json(400).json({
      msg: "Invalid Domain"
    })
  }

  const domain = paresedInput.data.domain.toLowerCase();
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
