const router = require('express').Router()
// const { validate } = require('../../utils/validator')
// const schema = require('../../validators/ppob')
const method = require('../../methods/midtrans_payment_channel')

router.get('/', method.getPaymentChannelList)

module.exports = router