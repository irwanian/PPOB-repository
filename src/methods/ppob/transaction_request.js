const PpobRepository = require('../../repositories/ppob')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')

module.exports = requestPpobTransaction = async (req, res) => {
    const { user_id, product_id, destination_number } = req.body
    
    try {
        let products = await PpobRepository.findOne({ id: product_id })
        products = Helpers.parseDataObject(products)

        const transactionPayload = {
            user: { name: 'TEST STAGING' },
            destination_number,
            status: 'pending',
            payment_id: null,
            ppob_product_id: products.id,
            purchase_price: products.purchase_price,
            selling_price: products.selling_price
        }

        const payload = await PpobTransactionRepository.create(transactionPayload)
        
        return res.success({ payload: {
            transaction_id: payload.id
        } })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}