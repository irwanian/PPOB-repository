const PdamCodeRepository = require('../../repositories/pdam_code')
const Helpers = require('../../utils/helpers')

module.exports = getPdamCodeList = async (req, res) => {
    
    try {
        const orderBy  = [['name', 'asc']]

        let products = await PdamCodeRepository.findAll({}, 0, Number(500), orderBy)
        products = Helpers.parseDataObject(products)

        const payload = products.map(val => {
            return { name: val.name, code: val.code }
        })

        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}