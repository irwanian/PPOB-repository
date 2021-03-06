const Moment = require('moment-timezone')
const Models = require('../../models')
const PpobProductRepository = require('../../repositories/ppob')
const PaymentRepository = require('../../repositories/payment')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const ApiDependency = require('../../utils/api_dependency')
const PaymentService = require('../../services/payment')

module.exports = requestSnap = async (req, res) => {
    const dbTransaction = await Models.sequelize.transaction()

try {
        const { body, session } = req
        const transaction = await PpobTransactionRepository.findOne({ id: body.transaction_id, status: 'pending' })

        const ppob_product = await PpobProductRepository.findOne({ id: transaction.ppob_product_id })

        if (!transaction) {
            return res.error({ message: 'Data Transaksi Tidak Ditemukan' })
        } else if (!ppob_product) {
            return res.error({ message: 'Produk Tidak Ditemukan' })
        } else if (transaction.ppob_product_id !== ppob_product.id) {
            return res.error({ message: 'Data Transaksi Tidak Sesuai, Mohon Ulangi Kembali Transaksi Anda' })
        }

        try {
            const orderId = PaymentService.getOrderId(session.slug.split('-')[1])
            const payload = {
                transaction_details: {
                    gross_amount: transaction.selling_price,
                    order_id: orderId
                },
                expiry: {
                    unit: 'hours',
                    duration: 24
                  },
            }
            const result = await ApiDependency.requestMidtransSnap(payload)
            if (!result.status) {
                return res.error({ message: result.message })
            }


            const paymentPayload = {
                order_id: orderId,
                payment_code: result.data.token,
                nominal: ppob_product.selling_price,
                payment_channel_id: 0,
                status: 'pending',
                expired_at: Moment().tz('Asia/Jakarta').add(24, 'hours').format('YYYY-MM-DD HH:mm:ss')
            }

            const payment = await PaymentRepository.create(paymentPayload, dbTransaction)
            
            await PpobTransactionRepository.update(body.transaction_id, { payment_id: payment.id }, dbTransaction)
            await dbTransaction.commit()
          
            return res.success({ payload: result.data })
        } catch (error) {
            if (dbTransaction) {
                dbTransaction.rollback()
            }
        }
        
    } catch (error) {
        return res.error(error)
    }
}