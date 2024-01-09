const express = require('express')
const router = express.Router()
const passport = require('passport')

const credentialsController = require('../controllers/credentials_controller')
const operationController = require('../controllers/operation_controller')
const scanController = require('../controllers/scan_controller')
const statisticsController = require('../controllers/statistics_controller')

router.get('/getBusinessImpact/:email', passport.authenticate('headerapikey', {
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
