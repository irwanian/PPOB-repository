const qs = require('qs')
const ApiDependency = require('../../utils/api_dependency')

module.exports = inquiryPln = async (req, res) => {
    const { destination_number } = req.body
    
    try {
        const inquiryPayload = qs.stringify({
            ptype: 'pln',
            custid: destination_number
        })

        const payload = await ApiDependency.inquiryPln(inquiryPayload)
        
        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}