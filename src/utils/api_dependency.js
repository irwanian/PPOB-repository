const axios = require('axios')
const Helpers = require('../utils/helpers')

module.exports.buyPrepaidPpobProduct = async (params) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_PREPAID_URL}/v3/h2h`
    
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        const narindoResponse = await axios.post(url, params, headers)
        result.data = narindoResponse.data

        return result
    } catch (error) {
        console.log(error)
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}

module.exports.testPrepaidPpobProduct = async (params, endpoint) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_PREPAID_URL}/v3/${endpoint}`
    console.log(url)
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        const narindoResponse = await axios.post(url, params, headers)
        result.data = narindoResponse.data
        
        return result
    } catch (error) {
        console.log(error)
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}

module.exports.buyPostpaidPpobProduct = async (payload) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_POSTPAID_URL}/url/payment`
    
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        const narindoResponse = await axios.post(url, payload, headers)
        result.data = narindoResponse.data

        return result
    } catch (error) {
        console.log(error)
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}

module.exports.checkStatusPostpaidPpobProduct = async (payload) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_POSTPAID_URL}/url/advice`
    
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        const narindoResponse = await axios.post(url, payload, headers)
        result.data = narindoResponse.data

        return result
    } catch (error) {
        console.log(error)
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}

module.exports.checkStatusPrepaidPpobProduct = async (payload) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_PREPAID_URL}/url/advice`
    
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        const narindoResponse = await axios.post(url, payload, headers)
        result.data = narindoResponse.data

        return result
    } catch (error) {
        console.log(error)
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}

module.exports.inquiryPostpaid = async (payload) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_POSTPAID_URL}/url/inquiry`
    
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        console.log(url, payload)
        const narindoResponse = await axios.post(url, payload, headers)
        result.data = narindoResponse.data
        console.log(result)

        return result
    } catch (error) {
        console.log(error)
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}

module.exports.inquiryPrepaidPln = async (params) => {
    const result = {
        status: true,
        code: 200,
        message: '',
        data: {}
    }
    const url = `${process.env.NARINDO_PREPAID_URL}/v3/inquiry`
    
    try {
        const headers = {
            headers: {
                Accept: '*/*',
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        const narindoResponse = await axios.post(url, params, headers)
        result.data = narindoResponse.data

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
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/x-www-form-urlencoded',
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

module.exports.requestMidtransSnap = async (payload) => {
    const result = {
        status: true,
        code: 200,
        data: {},
        message: ''
    }
    try {

        const midtransAuth = Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')
        const url = `${process.env.MIDTRANS_SNAP_API}/v1/transactions`
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Basic ' + midtransAuth
            }
        }
        const midtransResponse = await axios.post(url, payload ,headers)
        
        if (!String(midtransResponse.status).startsWith('2')) {
            result.status = false
            result.code = 400
            result.message = midtransResponse.message

            return result
        } 
        
        result.data = Helpers.parseDataObject(midtransResponse.data)       
        
        return result
    } catch (error) {
        result.status = false
        result.code = 500
        result.message = error.message
        return result
    }
}