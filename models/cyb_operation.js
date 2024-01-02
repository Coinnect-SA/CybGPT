module.exports = (mongoose) => {
  const CybOperationSchema = new mongoose.Schema({
    email: String,
    code: String,
    type: String,
    done: Boolean,
    params: {},
    createdAt: Date,
    doneAt: Date
  }, {
    strict: false
  })

  return CybOperationSchema
}
