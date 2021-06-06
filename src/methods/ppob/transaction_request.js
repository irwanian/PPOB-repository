const PpobRepository = require('../../repositories/ppob')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')
const PpobService = require('../../services/ppob')

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
            purchase_price: products.plan === 'prepaid' ? products.purchase_price : 0,
            selling_price: products.selling_price,
            detail: {}
        }

        const payload = await PpobTransactionRepository.create(transactionPayload)

        if (products.provider.toLowerCase() === 'pln') {

        } 
        
        return res.success({ payload: {
            transaction_id: payload.id
        } })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}