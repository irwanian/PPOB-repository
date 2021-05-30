const Models = require('../../models')
// const Transformer = require('../../transformers/ppob/ppob_list')
const PaymentService = require('../../services/payment')
const MidtransPaymentChannelRepository = require('../../repositories/midtrans_payment_channel')
const PpobProductRepository = require('../../repositories/ppob')
const PaymentRepository = require('../../repositories/payment')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')


module.exports = chargePayment = async (req, res) => {
    try {
        const { body } = req
        const [payment_channel, ppob_product, transaction] = await Promise.all([
            MidtransPaymentChannelRepository.findOne({ id: body.payment_channel_id }),
            PpobProductRepository.findOne({ id: body.ppob_product_id }),
            PpobTransactionRepository.findOne({ id: body.transaction_id })
        ])

        if (!transaction) {
            return res.error({ message: 'Data Transaksi Tidak Ditemukan' })
        } else if (!payment_channel) {
            return res.error({ message: 'Channel Pembayaran tidak Ditemukan' })
        } else if (!ppob_product) {
            return res.error({ message: 'Produk Tidak Ditemukan' })
        } else if (transaction.ppob_product_id !== ppob_product.id || transaction.selling_price !== ppob_product.selling_price) {
            return res.error({ message: 'Data Transaksi Tidak Sesuai, Mohon Ulangi Kembali Transaksi Anda' })
        }

        let payload = await PaymentService.chargePayment(payment_channel, ppob_product, transaction)
        if (!payload.status) {
            console.log(payload)
            return res.error({ message: payload.message })
        }

        // const dbTransaction = await Models.sequelize.transaction()

        // try {
        //     const payment = await PaymentRepository.create(payload.data, dbTransaction)
        //     await PpobTransactionRepository.update(body.transaction_id, { payment_id: payment.id }, dbTransaction)
        //     await dbTransaction.commit()
          
            return res.success({ payload })
        // } catch (error) {
        //     if (dbTransaction) {
        //         dbTransaction.rollback()
        //     }
        // }
        
    } catch (error) {
        return res.error(error)
    }
}