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
        // await PpobTransactionRepository.create({
        //     user: { name: 'test' },
        //     user_slug: 'test',
        //     destination_number: msisdn,
        //     status: 'failed',
        //     payment_id: 20213000111,
        //     purchase_price: products.purchase_price,
        //     selling_price: products.selling_price,
        //     detail: { request: payload.request, response: request.response }
        // })


        return res.success({ payload: {
            request: payload.request,
            response: payload.response
        } })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}