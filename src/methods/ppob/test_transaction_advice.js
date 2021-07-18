const PpobRepository = require('../../repositories/ppob')
const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')
const PpobService = require('../../services/ppob')

module.exports = testPpobPrepaid = async (req, res) => {
    const { user_id, product_id, destination_number } = req.body
    
    try {
        let products = await PpobRepository.findOne({ id: product_id })
        products = Helpers.parseDataObject(products)
        const user = {
            name: req.session.name,
            email: req.session.email,
            phone: req.session.phone
        }

        const { product_code, msisdn  } = req.body

        const transactionPayload = {
            product_code,
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