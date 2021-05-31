const qs = require('qs')
const ApiDependency = require('../../utils/api_dependency')

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

        return res.success({ payload: payload.data })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}