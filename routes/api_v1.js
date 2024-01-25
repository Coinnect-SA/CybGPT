const express = require('express')
const router = express.Router()
const passport = require('passport')

const credentialsController = require('../controllers/credentials')
const operationController = require('../controllers/operation')
const scanController = require('../controllers/scan')
const statisticsController = require('../controllers/statistics')

router.get('/getBusinessImpact/:domain', passport.authenticate('headerapikey', {
  session: false
}), scanController.getRawPages)

router.get('/getIP/:ip', passport.authenticate('headerapikey', {
  session: false
}), scanController.scanIP)

router.get('/scanCompany', passport.authenticate('headerapikey', {
  session: false
}), scanController.scanCompany)

router.get('/checkEmailCredentials/:email', passport.authenticate('headerapikey', {
  session: false
}), credentialsController.checkEmailCredentials)

router.get('/getRansomwareStats', passport.authenticate('headerapikey', {
  session: false
}), statisticsController.getRansomwareStats)

router.get('/doOperation/:operationCode', passport.authenticate('headerapikey', {
  session: false
}), operationController.doOperation)

module.exports = router
