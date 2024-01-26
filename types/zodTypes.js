const { z } = require('zod')

const EmailType = z.object({
  email: z.string().min(1, { message: 'This field is required' }).email('Please enter a valid email')
})

module.exports = { EmailType }
