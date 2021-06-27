const qs = require('qs')
const ApiDependency = require('../../utils/api_dependency')
const Helpers = require('../../utils/helpers')
const Transformer = require('../../transformers/ppob/inquiry_postpaid')
const PpobProductRepository = require('../../repositories/ppob')
const InquiryPostpaidRepository = require('../../repositories/narindo_postpaid_inquiry')

module.exports = inquiryPostpaid = async (req, res) => {
    const { destination_number, product_id } = req.body

    try {
        const product = await PpobProductRepository.findOne({ id: product_id })

        let inquiryPayload = qs.stringify({
            ptype: product.code.split('-')[1],
            custid: destination_number,
            userid: process.env.NARINDO_POSTPAID_USER_ID
        })

        if(inquiryPayload.toUpperCase().includes('%3A')) {
            console.log('masup')
            inquiryPayload = inquiryPayload.replace('%3A', ':')
        }

        let inquiryResult = await ApiDependency.inquiryPostpaid(inquiryPayload)
        console.log(inquiryResult)
        if (!inquiryResult.status) {
            return res.error({ message: inquiryResult.message })
        } else if (inquiryResult.data.status !== 1) {
            return res.error({ message: 'Inquiry Error' })
        }

        inquiryResult = Helpers.parseDataObject(inquiryResult.data)
        
        const createInquiryPayload = {
            detail: inquiryResult,
            ptype: product.code.split('-')[1],
            destination_number,
            timestamp: inquiryResult.timestamp || '',
            customer_name: inquiryResult.info1.name || '',
            amount: inquiryResult.info1.amount || 0,
            fee: product.selling_price,
        }

        let payload = {};

        if (inquiryResult.status === 1) {
            payload = await InquiryPostpaidRepository.create(createInquiryPayload)
        } else {
            payload = createInquiryPayload
        }

        payload.dataValues.product_id = product_id

        return res.success({ payload: payload.dataValues })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}