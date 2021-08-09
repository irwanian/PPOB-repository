const PpobProductService = require('../../services/ppob')
const Helpers = require('../../utils/helpers')

module.exports = insertPpobProducts = async (req, res) => {
    try {
        const { data, vendor } = req.body

        const productinserted = await PpobProductService.insertProducts(data, vendor)

        const payload = Helpers.parseDataObject(productinserted)

        res.success({ payload })
    } catch (error) {
        res.error(error)
    }
}