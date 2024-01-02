const express = require('express')
const path = require('path')
const app = express()
const helmet = require('helmet')
const passport = require('passport')
const HeaderAPIKeyStrategy = require('passport-headerapikey').HeaderAPIKeyStrategy

const { ApiUser } = require('./models/mongodb')
const apiV1 = require('./routes/api_v1')

app.use(helmet())

passport.use(new HeaderAPIKeyStrategy({
  header: 'X-API-KEY',
  prefix: ''
},
false,
function (apikey, done) {
  ApiUser.findOne({ api_key: apikey })
    .then((apiUser) => {
      if (!apiUser) {
        return done(null, false)
      }
      return done(null, apiUser)
    })
    .catch((error) => {
      return done(error)
    })
}
))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1', apiV1)

app.use(function (req, res, next) {
  res.sendStatus(404)
})

module.exports = app
