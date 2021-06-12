const PpobRepository = require('../../repositories/ppob')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const InquiryRepository = require('../../repositories/narindo_postpaid_inquiry')
const Helpers = require('../../utils/helpers')
const PpobService = require('../../services/ppob')

module.exports = requestPpobPostpaidTransaction = async (req, res) => {
    const { user_id, product_id, inquiry_id } = req.body
    
    try {
        let [products, inquiry] = await Promise.all([
            PpobRepository.findOne({ id: product_id }),
            InquiryRepository.findOne({ id: inquiry_id })
        ]) 

        products = Helpers.parseDataObject(products)
        inquiry = Helpers.parseDataObject(inquiry)
 
        const transactionPayload = {
            user: req.session,
            destination_number: inquiry.destination_number,
            status: 'pending',
            payment_id: null,
            ppob_product_id: products.id,
            purchase_price: Number(inquiry.amount) + Number(products.purchase_price),
            selling_price: Number(inquiry.amount) + Number(products.selling_price),
            detail: {
                ptype: inquiry.ptype,
                timestamp: inquiry.timestamp
            }
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