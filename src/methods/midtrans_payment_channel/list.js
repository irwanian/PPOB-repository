const MidtransPaymentChannelRepository = require('../../repositories/midtrans_payment_channel')
const Helpers = require('../../utils/helpers')
const { Op } = require('sequelize')

const setOffset = (page, limit) => {
    return Helpers.offsetPagination(page, limit)
}

module.exports = getMidtransPaymentChannelList = async (req, res) => {
    const { id, code, category, page = 1, limit = 20 } = req.query 
    
    try {
        const wheres = []
        const offset = setOffset(page, limit)
        
        if (code) {
            wheres.push({ code })
        }
        if (category) {
            wheres.push({ category })
        }
        if (id) {
            wheres.push({ id })
        }

        wheres.push({ is_active: 1 })

        const mergedWheres = { [Op.and]: wheres }
        const orderBy  = [['id', 'asc']]

        let products = await MidtransPaymentChannelRepository.findAll(mergedWheres, offset, Number(limit), orderBy)
        products.rows = Helpers.parseDataObject(products)

        const payload = products

        return res.success({ payload })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}