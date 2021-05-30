const Models = require('../../models')
// const Transformer = require('../../transformers/ppob/ppob_list')
const PaymentService = require('../../services/payment')
const MidtransPaymentChannelRepository = require('../../repositories/midtrans_payment_channel')
const PpobProductRepository = require('../../repositories/ppob')
const PaymentRepository = require('../../repositories/payment')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')


module.exports = handleNotification = async (req, res) => {
    try {
        const { body } = req
        const result = await PaymentService.handleMidtransNotification(body)
        res.success({ payload: result })
    } catch (error) {
        return res.error(error)
    }
}