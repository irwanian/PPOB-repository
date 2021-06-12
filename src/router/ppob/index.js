const router = require('express').Router()
const { validate } = require('../../utils/validator')
const schema = require('../../validators/ppob')
const method = require('../../methods/ppob')
const AuthMiddleware = require('../auth_middleware')

router.get('/', [AuthMiddleware], validate(schema.getPpobList), method.getPpobList)
router.post('/insert-multiple', [AuthMiddleware], method.insertPpobProducts)
router.post('/transaction/inquiry-prepaid', [AuthMiddleware], method.inquiryPrepaidPln)
router.post('/transaction/inquiry-postpaid', [AuthMiddleware], method.inquiryPostpaid)
router.post('/transaction/prepaid/request', [AuthMiddleware], method.requestPpobPrepaidTransaction)
router.post('/transaction/postpaid/request', [AuthMiddleware], method.requestPpobPostpaidTransaction)

module.exports = router