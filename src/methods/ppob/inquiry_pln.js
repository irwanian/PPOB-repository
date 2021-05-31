const qs = require('qs')
const ApiDependency = require('../../utils/api_dependency')
const Helpers = require('../../utils/helpers')

module.exports = inquiryPln = async (req, res) => {
    const { destination_number } = req.body
    
    try {
        const inquiryPayload = qs.stringify({
            ptype: 'pln',
            custid: destination_number
        })

        let payload = await ApiDependency.inquiryPln(inquiryPayload)
        if (!payload.status) {
            return res.error({ message: payload.message })
        }

        payload = Helpers.parseDataObject(payload.data)

        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}