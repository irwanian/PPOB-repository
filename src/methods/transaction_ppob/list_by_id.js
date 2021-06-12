const PpobTransactionRepository = require('../../repositories/ppob_transaction')
const Helpers = require('../../utils/helpers')
const Transformer = require('../../transformers/ppob_transaction/list_by_id')

const setOffset = (page, limit) => {
    return Helpers.offsetPagination(page, limit)
}

module.exports = getTransactionPpobListById = async (req, res) => {
    const { page = 1, limit = 20, category } = req.query 
    
    try {
        const wheres = { slug: req.session.slug }
        const offset = setOffset(page, limit)
        
        if (category) {
            wheres.category = category
        }

        const orderBy  = 'id'

        let products = await PpobTransactionRepository.getRawList(wheres, offset, Number(limit), orderBy)
        let meta = await PpobTransactionRepository.getMetaData(wheres) 
        products = Helpers.parseDataObject(products)
        meta = Helpers.parseDataObject(meta)
        const metaSummary = {
            page: Number(page),
            limit: Number(limit),
            total_data: meta[0].count,
            total_page: Math.ceil(meta[0].count / limit)
        }

        let payload = Transformer.transform(products)
        payload = payload.sort((a, b) => a.id > b.id ? -1 : b.id > a.id ? 1 : 0)

        return res.success({ payload, meta: metaSummary })
    } catch (error) {
        console.log(error)
        return res.error(error)
    }
}