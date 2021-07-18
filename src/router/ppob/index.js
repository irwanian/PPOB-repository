const router = require('express').Router()
const { validate } = require('../../utils/validator')
const schema = require('../../validators/ppob')
const method = require('../../methods/ppob')
const AuthMiddleware = require('../auth_middleware')

router.get('/', validate(schema.getPpobList), method.getPpobList)
router.get('/pdam', method.getPdamList)
router.post('/insert-multiple', [AuthMiddleware], method.insertPpobProducts)
router.post('/transaction/inquiry-prepaid', [AuthMiddleware], method.inquiryPrepaidPln)
router.post('/transaction/inquiry-postpaid', [AuthMiddleware], method.inquiryPostpaid)
router.post('/transaction/prepaid/request', [AuthMiddleware], method.requestPpobPrepaidTransaction)
router.post('/transaction/postpaid/request', [AuthMiddleware], method.requestPpobPostpaidTransaction)
router.post('/transaction/check-status', [AuthMiddleware], method.checkTransactionStatus)
router.post('/transaction/prepaid/test-transaction/:endpoint', method.testTransactionAdvice)

module.exports = router
