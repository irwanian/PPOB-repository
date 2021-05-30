const router = require('express').Router()
// const { validate } = require('../../utils/validator')
// const schema = require('../../validators/ppob')
const method = require('../../methods/payment')

router.post('/charge', method.chargePayment)
router.post('/midtrans/notification', method.handleNotification)

module.exports = router