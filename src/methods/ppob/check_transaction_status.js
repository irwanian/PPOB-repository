const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')
const ApiDependency = require('../../utils/api_dependency')

module.exports = checkTransactionStatus = async (req, res) => {
    const { transaction_id } = req.body
    
    try {
        let transaction = await PpobTransactionRepository.findOne({ id: transaction_id, status: 'pending' })

        if (!transaction) {
            return res.error({ code: 404, message: 'Data Transaksi Tidak Ditemukan' })
        }
        
        transaction = Helpers.parseDataObject(transaction)
        
        let product = await PpobTransactionRepository.findOne({ id: product_id })
        product = Helpers.parseDataObject(product)

        const transactionPayload = {
            userid: product.plan.toLowerCase() === 'prepaid' ? process.env.NARINDO_PREPAID_USER_ID : process.env.NARINDO_POSTPAID_USER_ID,
            reqid: transaction.detail.reqid,
        }

        let result

        if (product.plan.toLowerCase() === 'prepaid') {
            result = await ApiDependency.checkStatusPrepaidPpobProduct(transactionPayload)
        } else {
            result = await ApiDependency.checkStatusPostpaidPpobProduct(transactionPayload)
        }

        if (!result.status){
            return res.error({ code: 400, message: 'Cek Status Transaksi Gagal' })
        }

        let status

        if (result.data.status === 1) {
            status = 'success'
        } else if (result.data.status === 2) {
            status = 'pending'
        } else {
            status = 'failed'
        }

        await PpobTransactionRepository.update(transaction.id, { status })

        return res.success({ payload: { status }})
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}