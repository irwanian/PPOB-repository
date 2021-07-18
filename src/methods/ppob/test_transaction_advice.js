const PpobRepository = require('../../repositories/ppob')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')
const PpobService = require('../../services/ppob')

module.exports = testPpobPrepaid = async (req, res) => {
    const { product_id, msisdn } = req.body
    
    try {
        let products = await PpobRepository.findOne({ id: product_id })
        products = Helpers.parseDataObject(products)
        
        const transactionPayload = {
            product_code: products.code.split('-')[1],
            msisdn
        }

        const payload = await PpobService.testPrepaidTransaction(transactionPayload, req.params.endpoint)

        return res.success({ payload: {
            transaction_id: payload.id
        } })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}