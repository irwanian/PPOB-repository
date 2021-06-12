const moment = require('moment-timezone')
const crypto = require('crypto')
const ApiDependency = require('../utils/api_dependency')
const PpobTransactionRepository = require('../repositories/ppob_transaction')
const PpobProductRepository = require('../repositories/ppob')
const PaymentRepository = require('../repositories/payment')
const Models = require('../models')
const PpobService = require('./ppob')

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
            payment_channel_name: data.payment_channel_name,
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
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id, payment_channel_name: params.payment_channel_name })
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
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id, payment_channel_name: params.payment_channel_name })
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
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id, payment_channel_name: params.payment_channel_name })
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
        return mapChargeResponse({ ...result.data, nominal: params.nominal, payment_channel_id: params.payment_channel_id, payment_channel_name: params.payment_channel_name })
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
        payment_channel_name: payment_channel.name,
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

    const expired_at = moment().tz('Asia/Jakarta').add('24', 'hours').format('YYYY-MM-DD HH:mm:ss')
    result.data.expired_at = expired_at

    return result
}

const getMidtransSignatureKey = (params) => {
    return crypto
            .createHash('sha512')
            .update(params.order_id+params.status_code+params.gross_amount+process.env.MIDTRANS_SERVER_KEY)
            .digest('hex')
}

const mapResponsePayload = (data, product) => {
    let status
    
    if (data.status === 1) {
        status = 'success'
    } else if (data.status === 2) {
        status = 'pending'
    } else {
        status = 'failed'
    }

    if(product.plan === 'prepaid') {
        console.log(product.provider.toLowerCase())
        if (product.provider.toLowerCase().includes('pln')) {
            const token = data.sn.split('Token ')[1]
            const kwh = data.sn.split('kWh ')[1].split(' ')[0]
            
            result.token = token || null
            result.kwh = kwh || null
            result.sn = null
            result.status = status
            result.message = data.message || null
        } else {
            result.token = null
            result.kwh = null
            result.serial_number = data.sn || null
            result.status = status
            result.message = data.message || null
        }
    } else {
        result.token = data['info1'].stand_meter || null
        console.log('a', result)
        result.kwh = null
        console.log('b', result)
        result.sn = data.sn || null
        console.log('c', result)
        result.status = status
        console.log('d', result)
        result.message = data.message || null
        console.log('e', result)
    }

    return result
}

const updatePrepaidPaymentStatus = async (order_id, status, oldStatus, dbTransaction) => {
    const paymentUpdatePayload = {
        status,
        expired_at: moment().tz('Asia/jakarta').format('YYYY-MM-DD HH:mm:ss')
    }
    try {
        let detail = {
                token: null,
                kwh: null,
                sn: null,
                status: null,
                message: null
        }
        const updatedPayment = await PaymentRepository.updateByOrderId(order_id, paymentUpdatePayload, dbTransaction)
        const transactionData = await PpobTransactionRepository.findOne({ payment_id: updatedPayment.id }, dbTransaction)  
        

        if (status === 'settlement' && transactionData.status !== 'success' && oldStatus === 'pending') {
            console.log("let's proceed", transactionData.destination_number)
            const product = await PpobProductRepository.findOne({ id: transactionData.ppob_product_id })
            
            const payloadPpobTransaction = {}
            let processedTransaction

            if (product.plan === 'prepaid') {
                payloadPpobTransaction.msisdn = transactionData.destination_number,
                payloadPpobTransaction.product_code = product.code.split('-')[1]
                processedTransaction = await PpobService.processPrepaidTransaction(payloadPpobTransaction)
                detail = mapResponsePayload(processedTransaction, product)
            } else if (product.plan === 'postpaid') {
                payloadPpobTransaction.custid = transactionData.destination_number
                payloadPpobTransaction.timestamp = transactionData.detail.timestamp
                payloadPpobTransaction.ptype = transactionData.detail.ptype

                processedTransaction = await PpobService.processPostpaidTransaction(payloadPpobTransaction)
                if (processedTransaction.status === 1) detail.status = 'success'
                detail = mapResponsePayload(processedTransaction, product)
                console.log(detail)
            }
            

        } else if (status === 'expire' && transactionData.status === 'pending' && oldStatus === 'pending') {
            detail.status = 'failed'
        } else if (status === 'failure' && transactionData.status === 'pending' && oldStatus === 'pending') {
            detail.status = 'failed'
        } else if (status === 'deny' && transactionData.status === 'pending' && oldStatus === 'pending') {
            detail.status = 'failed'
        }

        await PpobTransactionRepository.updateByPaymentId(updatedPayment.id, { status: detail.status, detail } , dbTransaction)
        await dbTransaction.commit()

        return processedTransaction
    } catch (error) {
        if (dbTransaction) {
            await dbTransaction.rollback()
            return 'error'
        }
    }
}

const handleMidtransNotification = async (params) => {
    const result = {
        status: true,
        message: ''
    }
    console.log('incoming payment response from midtrans====', params)

    const dbTransaction = await Models.sequelize.transaction()
    const { signature_key, status_code, gross_amount, order_id, transaction_status } = params
    const oldPaymentData = await PaymentRepository.findOne({ order_id })
    if (signature_key === getMidtransSignatureKey(params)) {
        const updateResult = await updatePrepaidPaymentStatus(order_id, transaction_status, oldPaymentData.status, dbTransaction)
        
        if (updateResult !== 'error') {
            result.message = 'success'
        } else {
            result.status = false
            result.message = 'error'
        }

        return result
    } else {
        return 'pending'
    }
}

module.exports = {
    chargePayment,
    handleMidtransNotification,
    getOrderId
}