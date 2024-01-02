module.exports = (mongoose) => {
  const ApiUserSchema = new mongoose.Schema({
    name: String,
    api_key: {
      type: String,
      unique: true
    }
  })
  return ApiUserSchema
}
