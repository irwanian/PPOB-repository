const { Op } = require('sequelize')
const MidtransPaymentRepository = require('../../repositories/payment')
const Helpers = require('../../utils/helpers')

module.exports = getPaymentDetail = async (req, res) => {
    try {
        if (!req.params.order_id || req.params.order_id.length < 22) {
            return res.error({ message: 'Invalid Order ID' })
        }

        let payload = await MidtransPaymentRepository.findOne({ order_id: req.params.order_id })
        payload = Helpers.parseDataObject(payload)
        payload = {
            order_id: payload.order_id,
            nominal: payload.nominal,
            paid_at: payload.paid_at
        }

        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}