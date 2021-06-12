const router = require('express').Router()
// const { validate } = require('../../utils/validator')
// const schema = require('../../validators/ppob')
const method = require('../../methods/payment')
const AuthMiddleware = require('../auth_middleware')

router.post('/charge', [AuthMiddleware], method.chargePayment)
router.post('/midtrans/notification', method.handleNotification)
router.post('/midtrans/snap', [AuthMiddleware], method.midtransSnap)

module.exports = router