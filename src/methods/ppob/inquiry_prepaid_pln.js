const qs = require('qs')
const ApiDependency = require('../../utils/api_dependency')
const Helpers = require('../../utils/helpers')
const Transformer = require('../../transformers/ppob/inquiry_prepaid_pln')


module.exports = inquiryPrepaidPln = async (req, res) => {
    const { destination_number } = req.body
    
    try {
        const inquiryPayload = qs.stringify({
            ptype: 'pln',
            custid: destination_number,
            userid: process.env.NPRI
        })

        let inquiryResult = await ApiDependency.inquiryPrepaidPln(inquiryPayload)
        console.log(inquiryResult)
        if (!inquiryResult.status) {
            return res.error({ message: inquiryResult.message })
        } else if (![1, 0].includes(inquiryResult.data.status)) {
            return res.error({ message: 'Inquiry Error' })
        }

        inquiryResult = Helpers.parseDataObject(inquiryResult.data)

        const payload = Transformer.transform(inquiryResult)
        // const payload = inquiryResult

        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}