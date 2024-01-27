const { z } = require('zod')

const EmailType = z.object({
  email: z.string().min(1, { message: 'This field is required' }).email('Please enter a valid email')
})

const IpAddressType = z.object({
  ip: z.string().ip({ message: 'Invalid IP address' })
})

const DomainType = z.object({
  domain: z.refine((data) => {
    const domain_regex = /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/;
    return domain_regex.test(data);
  })
})

module.exports = { EmailType, IpAddressType, DomainType }
