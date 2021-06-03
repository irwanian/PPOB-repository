const qs = require('qs')
const ApiDependency = require('../../utils/api_dependency')
const Helpers = require('../../utils/helpers')
const Transformer = require('../../transformers/ppob/inquiry_pln')


module.exports = inquiryPln = async (req, res) => {
    const { destination_number } = req.body
    
    try {
        const inquiryPayload = qs.stringify({
            ptype: 'pln',
            custid: destination_number,
            userid: process.env.NARINDO_USER_ID
        })

        let inquiryResult = await ApiDependency.inquiryPln(inquiryPayload)
        if (!inquiryResult.status) {
            return res.error({ message: inquiryResult.message })
        }

        inquiryResult = Helpers.parseDataObject(inquiryResult.data)

        // const payload = Transformer.transform(inquiryResult)
        const payload = inquiryResult
        
        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}