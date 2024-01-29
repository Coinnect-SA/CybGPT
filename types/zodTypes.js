const { z } = require('zod')

const EmailType = z.object({
  email: z.string().min(1, { message: 'This field is required' }).email('Please enter a valid email')
})

const IpAddressType = z.string().ip({ message: 'Invalid IP address' })

module.exports = { EmailType, IpAddressType }
