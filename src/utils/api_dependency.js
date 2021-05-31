const axios = require('axios')
const Helpers = require('../utils/helpers')

module.exports.buyPpobProduct = async (params) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_URL}/v3/h2h`
    
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded",
                Host: "210.210.178.14:9902"
            }
        }

        const narindoResponse = await axios.post(url, params, headers)
        console.log(narindoResponse)
        result.data = narindoResponse
        return result
    } catch (error) {
        console.log(error)
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}

module.exports.chargeMidtransPayment = async (payload) => {
    const result = {
        status: true,
        code: 200,
        data: {},
        message: ''
    }
    try {

        const midtransAuth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')
        const url = `${process.env.MIDTRANS_API}/v2/charge`
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Basic ' + midtransAuth
            }
        }
        const { data: midtransResponse } = await axios.post(url, payload ,headers)
        
        if (!midtransResponse.status_code.startsWith('2')) {
            result.status = false
            result.code = 400
            result.message = midtransResponse.status_message

            return result
        } 
        
        result.data = Helpers.parseDataObject(midtransResponse)       
        
        return result
    } catch (error) {
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}