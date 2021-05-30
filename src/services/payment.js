const moment = require('moment-timezone')
const crypto = require('crypto')
const ApiDependency = require('../utils/api_dependency')


const getOrderId = (slug = Math.floor(Math.random() * 10000) + 1000) => {
    const [fromYearsToDate, fromHoursToSeconds] = moment().format('YYYYMMDD-hhmmss').split('-')

    const orderId = `MT-${fromYearsToDate}${slug}${fromHoursToSeconds}`

    return orderId
}

const getPaymentCode = (params) => {
    let paymentCode = null
    
    if (params.bill_key) {
        paymentCode = params.bill_key
    } else if (params.permata_va_number) {
        paymentCode = params.permata_va_number
    } else if (params.va_numbers) {
        paymentCode = params.va_numbers[0].va_number
    } else if (params.payment_code) {
        paymentCode = params.payment_code
    } 

    return paymentCode
}

const getEwalletDeepLink = (params) => {
    console.log({ params })
    let link = null
    if (params.actions) {
        if (params.actions.length > 1) {
            link = params.actions[1].url
        } else {
            link = params.actions[0].url
        }
    }

    return link
}

const mapChargeResponse = (data) => {
        return {
            payment_code: getPaymentCode(data),
            order_id: data.order_id,
            nominal: data.nominal,
            payment_channel_id: data.payment_channel_id,
            ewallet_link: getEwalletDeepLink(data),
            status: 'pending'
        }
}

const chargeEchannel = async (params) => {
    const body = {
        payment_type: params.payment_type,
        transaction_details: {
            order_id: getOrderId(),
            gross_amount: params.nominal
        },
        echannel: {
            bill_info1: "Pembayaran:",
            bill_info2: params.product_name
        }
    }
    const result = await ApiDependency.chargeMidtransPayment(body)
    if (!result.status) {
        throw new Error(result.message)
    } else {
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id })
    }
}

const chargeBankTransfer = async (params) => {
    const body = {
        payment_type: params.payment_type,
        transaction_details: {
            order_id: getOrderId(),
            gross_amount: params.nominal
        },
        bank_transfer: {
            bank: params.bank
        }
    }

    const result = await ApiDependency.chargeMidtransPayment(body)
    if (!result.status) {
        throw new Error(result.message)
    } else {
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id })
    }
}

const chargeEwallet = async (params) => {
    const body = {
        payment_type: params.payment_type,
        transaction_details: {
            order_id: getOrderId(),
            gross_amount: params.nominal
        }
    }

    const result = await ApiDependency.chargeMidtransPayment(body)
    if (!result.status) {
        throw new Error(result.message)
    } else {
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id })
    }
}

const chargeOverTheCounter = async (params) => {
    const body = {
        payment_type: params.payment_type,
        transaction_details: {
            order_id: getOrderId(),
            gross_amount: params.nominal
        },
        cstore: {
            store: params.bank,
            message: 'Pembelian Produk PPOB Kartunet',
            alfamart_free_text_1: 'Pembelian Produk PPOB Kartunet'
        }
    }

    const result = await ApiDependency.chargeMidtransPayment(body)
    if (!result.status) {
        throw new Error(result.message)
    } else {
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id })
    }
}

const chargePayment = async (payment_channel, ppob) => {
    const result = {
        code: 200,
        status: true,
        data: {},
        message: ''
    }

    const params = {
        payment_channel_id: payment_channel.id,
        payment_type: payment_channel.category,
        nominal: ppob.selling_price,
        product_name: ppob.name,
        bank: payment_channel.code
    }

    if (payment_channel.category === 'echannel') {
        result.data = await chargeEchannel(params)
    } else if (payment_channel.category === 'bank_transfer') {
        result.data = await chargeBankTransfer(params)
    }  else if (payment_channel.category === 'gopay') {
        result.data = await chargeEwallet(params)
    }  else if (payment_channel.category === 'cstore') {
        result.data = await chargeOverTheCounter(params)
    }

    const expired_at = moment().tz('Asia/Jakarta').add('24', 'hours').format('YYYY-MM-DD hh:mm:ss')
    result.data.expired_at = expired_at

    return result
}

const getMidtransSignatureKey = (params) => {
    return crypto
            .createHmac('sha512')
            .update(params.order_id+params.status_code+params.gross_amount+process.env.MIDTRANS_SERVER_KEY)
}

const handleMidtransNotification = async (params) => {
    const { signature_key, status_code, gross_amount, order_id, transaction_status } = params
    if (signature_key === getMidtransSignatureKey(params)) {
        if (status_code === '200' && transaction_status === 'settlement') {
           // update ppob transaction status & payment status
           console.log('settlement')
           return 'BANZAI!!!'
        }
    }
}

module.exports = {
    chargePayment,
    handleMidtransNotification
}