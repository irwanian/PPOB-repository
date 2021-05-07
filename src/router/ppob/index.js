const router = require('express').Router()
const { validate } = require('../../utils/validator')
const schema = require('../../validators/ppob')
const method = require('../../methods/ppob')

router.get('/', validate(schema.getPpobList), method.getPpobList)
router.post('/insert-multiple', method.insertPpobProducts)

module.exports = router