const PpobRepository = require('../../repositories/ppob')
const Helpers = require('../../utils/helpers')
const { Op } = require('sequelize')

const setOffset = (page, limit) => {
    return Helpers.offsetPagination(page, limit)
}

module.exports = getPpobList = async (req, res) => {
    const { page = 1, limit = 20, id, provider, category } = req.query 
    
    try {
        const wheres = []
        const offset = setOffset(page, limit)
        
        if (provider) {
            wheres.push({ provider })
        }
        if (category) {
            wheres.push({ category })
        }
        if (id) {
            wheres.push({ id })
        }

        const mergedWheres = { [Op.and]: wheres }
        const orderBy  = [['selling_price', 'asc']]

        const products = await PpobRepository.findAndCountAll(mergedWheres, offset, Number(limit), orderBy)
        const metaSummary = {
            page: Number(page),
            limit: Number(limit),
            total_data: products.count,
            total_page: Math.ceil(products.count / limit)
        }
        const payload = Helpers.parseDataObject(products.rows)

        return res.success({ payload, meta: metaSummary })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}