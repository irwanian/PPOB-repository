const router = require('express').Router()
const { validate } = require('../../utils/validator')
const schema = require('../../validators/ppob')
const method = require('../../methods/transaction_ppob')
const AuthMiddleware = require('../auth_middleware')

router.get('/:id', [AuthMiddleware], method.getPpobTransactionListById)

module.exports = router