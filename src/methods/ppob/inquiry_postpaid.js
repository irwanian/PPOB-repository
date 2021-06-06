const ApiDependency = require('../../utils/api_dependency')
const Helpers = require('../../utils/helpers')
const Transformer = require('../../transformers/ppob/inquiry_postpaid')
const PpobProductRepository = require('../../repositories/ppob')
const InquiryPostpaidRepository = require('../../repositories/narindo_postpaid_inquiry')

module.exports = inquiryPostpaid = async (req, res) => {
    const { destination_number, product_id } = req.body

    try {
        const product = await PpobProductRepository.findOne({ id: product_id })

        const inquiryPayload = {
            ptype: product.code.split('-')[1],
            custid: destination_number,
            userid: process.env.NARINDO_POSTPAID_USER_ID
        }

        let inquiryResult = await ApiDependency.inquiryPostpaid(inquiryPayload)
        if (!inquiryResult.status) {
            return res.error({ message: inquiryResult.message })
        }

        inquiryResult = Helpers.parseDataObject(inquiryResult.data)
        const createInquiryPayload = {
            detail: inquiryResult,
            ptype: inquiryPayload.ptype,
            destination_number,
            timestamp: 'test dulu',
            customer_name: 'test dulu'
        }

        const payload = await InquiryPostpaidRepository.create(createInquiryPayload)
        // const payload = Transformer.transform(inquiryResult)

        // const payload = inquiryResult

        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}