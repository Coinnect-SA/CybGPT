module.exports = (mongoose) => {
  const CybLogSchema = new mongoose.Schema({
    type: String,
    operation: String,
    createdAt: Date,
    params: {
      email: String,
      ip: String,
      countryCode: String,
      revenue: String,
      employees: String,
      ransomwareGroup: String,
      startDate: String,
      endDate: String,
      naicsCode: String
    }
  })

  return CybLogSchema
}
