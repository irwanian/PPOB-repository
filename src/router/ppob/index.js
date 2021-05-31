const router = require('express').Router()
const axios = require('axios')
const moment = require('moment-timezone')
const qs = require('qs')
const crypto = require('crypto')
const { validate } = require('../../utils/validator')
const schema = require('../../validators/ppob')
const method = require('../../methods/ppob')
const { NARINDO_USER_ID, NARINDO_PASSWORD } = process.env

const setReqId = () => {
    return 'ppob-' + moment().tz('Asia/Jakarta').format('YYYYMMDD') + String((Math.floor(Math.random() * 10000) + 1000))
}

const setTransactionSign = (params) => {
    const { reqId, msisdn, product } = params
    const sign = crypto
                    .createHash('sha1')
                    .update(reqId + msisdn + product + NARINDO_USER_ID + NARINDO_PASSWORD)
                    .digest('hex')
                    .toUpperCase()

    return sign
}

router.get('/', validate(schema.getPpobList), method.getPpobList)
router.post('/insert-multiple', method.insertPpobProducts)
router.post('/transaction/request', method.requestPpobTransaction)
router.post('/test/transaction', (req, res) => {
    const { destination_number, code } = req.body
    
        const reqId = setReqId()
        const sign = setTransactionSign({reqId, msisdn: destination_number, product: code})
        const queryParams = qs.stringify({ 
            reqid: reqId,
            msisdn: destination_number,
            product: code,
            userid: NARINDO_USER_ID,
            sign,
            mid: reqId
        })

        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    
        axios.post('https://h2hdev.narindo.com:9902/v3/h2h', queryParams, headers)
        .then((data) => {
            console.log('oy====', data)
            res.success(data.data)
        })
        .catch(err => {
            console.log('ey======', err)
            res.error(err.response ? err.response.data.message : err.message)
        })
})

module.exports = router