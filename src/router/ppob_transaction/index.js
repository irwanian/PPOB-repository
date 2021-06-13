const router = require('express').Router()
const method = require('../../methods/transaction_ppob')
const AuthMiddleware = require('../auth_middleware')

router.get('/:id', [AuthMiddleware], method.getPpobTransactionListById)

module.exports = router