const PaymentService = require('../../services/payment')

module.exports = handleNotification = async (req, res) => {
    try {
        const { body } = req
        const result = await PaymentService.handleMidtransNotification(body)
        if (!result.status) {
            return res.error({ message: result.message })
        }
        
        res.success({ payload: result.message })
    } catch (error) {
        return res.error(error)
    }
}