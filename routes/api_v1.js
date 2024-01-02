const express = require('express')
const router = express.Router()
const passport = require('passport')

const cybController = require('../controllers/cyb_controller')

router.get('/getBusinessImpact/:email', passport.authenticate('headerapikey', {
  session: false
}), cybController.getRawPages)

router.get('/getIP/:ip', passport.authenticate('headerapikey', {
  session: false
}), cybController.scanIP)

router.get('/checkEmailCredentials/:email', passport.authenticate('headerapikey', {
  session: false
}), cybController.checkEmailCredentials)

router.get('/getRansomwareStats', passport.authenticate('headerapikey', {
  session: false
}), cybController.getRansomwareStats)

router.get('/scanCompany', passport.authenticate('headerapikey', {
  session: false
}), cybController.scanCompany)

router.get('/doOperation/:operationCode', passport.authenticate('headerapikey', {
  session: false
}), cybController.doOperation)

module.exports = router
