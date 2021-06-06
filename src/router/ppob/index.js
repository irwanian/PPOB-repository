const router = require('express').Router()
const { validate } = require('../../utils/validator')
const schema = require('../../validators/ppob')
const method = require('../../methods/ppob')

router.get('/', validate(schema.getPpobList), method.getPpobList)
router.post('/insert-multiple', method.insertPpobProducts)
router.post('/transaction/inquiry-prepaid', method.inquiryPrepaidPln)
router.post('/transaction/inquiry-postpaid', method.inquiryPostpaid)
router.post('/transaction/prepaid/request', method.requestPpobPrepaidTransaction)
router.post('/transaction/postpaid/request', method.requestPpobPostpaidTransaction)

module.exports = router