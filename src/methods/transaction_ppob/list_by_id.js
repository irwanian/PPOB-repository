const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')
const { Op } = require('sequelize')

const setOffset = (page, limit) => {
    return Helpers.offsetPagination(page, limit)
}

module.exports = getTransactionPpobListById = async (req, res) => {
    const { page = 1, limit = 20, category } = req.query 
    
    try {
        const wheres = [{ user: { slug: req.session.slug }}]
        const offset = setOffset(page, limit)
        
        if (category) {
            wheres.push({ category })
        }

        const mergedWheres = { [Op.and]: wheres }
        const orderBy  = [['created_at', 'desc']]

        let products = await PpobTransactionRepository.findAndCountAll(mergedWheres, offset, Number(limit), orderBy)
        products.rows = Helpers.parseDataObject(products.rows)
        const metaSummary = {
            page: Number(page),
            limit: Number(limit),
            total_data: products.count,
            total_page: Math.ceil(products.count / limit)
        }

        const payload = products.rows

        return res.success({ payload, meta: metaSummary })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}