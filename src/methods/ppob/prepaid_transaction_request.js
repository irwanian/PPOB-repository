const PpobRepository = require('../../repositories/ppob')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')
const PpobService = require('../../services/ppob')

module.exports = requestPpobPrepaidTransaction = async (req, res) => {
    const { user_id, product_id, destination_number } = req.body
    
    try {
        let products = await PpobRepository.findOne({ id: product_id })
        products = Helpers.parseDataObject(products)
        const user = {
            name: req.session.name,
            email: req.session.email,
            phone: req.session.phone
        }

        const transactionPayload = {
            user,
            user_slug: req.session.slug,
            destination_number,
            status: 'pending',
            payment_id: null,
            ppob_product_id: products.id,
            purchase_price: products.purchase_price,
            selling_price: products.selling_price,
            detail: {}
        }

        const payload = await PpobTransactionRepository.create(transactionPayload)

        // if (products.provider.toLowerCase() === 'pln') {

        // } 
        
        return res.success({ payload: {
            transaction_id: payload.id
        } })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}