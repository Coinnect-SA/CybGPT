const { z } = require('zod')

const EmailType = z.object({
  email: z.string().min(1, { message: 'This field is required' }).email('Please enter a valid email')
})

const IpAddressType = z.object({
  ip: z.refine((data) => {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
    if (ipv4Regex.test(data)) {
      return data.split('.').every(part => parseInt(part) <= 255);
    }
    if (ipv6Regex.test(data)) {
      return data.split(':').every(part => part.length <= 4);
    }
    return false;

  }, {
    message: "Invalid Ip address",
  })
})

module.exports = { EmailType, IpAddressType }
