const { Sequelize, sequelize } = require('../models')
const Models = require('../models').ppob_transaction
const PaymentModels = require('../models').payment
const PpobProductModels = require('../models').ppob_product

const findAndCountAll = async (where = {}, offset = 1, limit = 20, order) => {
    return await Models.findAndCountAll({
        where,
        limit,
        offset,
        order
    })
}

const getRawList = async (where = {}, offset = 1, limit = 20, order) => {
  console.log(offset)  
    return await sequelize.query(
        `SELECT pt.id, pt.user, pt.destination_number, 
        pt.status, pt.payment_id, pt.ppob_product_id, pt.detail,
        pa.order_id as pa_order_id, pa.status AS pa_status,
        pt.purchase_price, pp.purchase_price as pp_purchase_price,
        pa.expired_at as pa_expired_at,
        pp.name AS pp_name, pp.provider AS pp_provider,
        pp.category AS pp_category FROM ppob_transactions AS pt 
        INNER JOIN payments AS pa ON pt.payment_id = pa.id INNER JOIN ppob_products AS pp
        ON pt.ppob_product_id = pp.id
        WHERE pt.user_slug = '${where.slug}'
        ORDER BY '${order}' DESC LIMIT ${offset}, ${limit};`,{
        raw: true,
        type: Sequelize.QueryTypes.SELECT    
        }
    )
}

const getMetaData = async (where = {}) => {
    return await sequelize.query(
        `SELECT count(pt.id) AS count FROM ppob_transactions AS pt
        INNER JOIN payments AS pa ON pt.payment_id = pa.id
        INNER JOIN ppob_products AS pp ON pt.ppob_product_id = pp.id
        WHERE pt.user_slug = '${where.slug}';`, {
        raw: true,
        type: Sequelize.QueryTypes.SELECT
        }
        ) 
    }
    
const findAll = async (where = {}, offset = 1, limit = 20, order) => {
    return await Models.findAll({
        where,
        limit,
        offset,
        order,
    })
}

const findOne = async (where = {}, transaction = null) => {
    return await Models.findOne({
        where,
        raw: true,
        transaction
    })
}

const create = async (data, transaction = null) => {
    return await Models.create(data, { transaction })
}

const update = async (id, data, transaction = null) => {
     return await Models.update(data, { where: { id }, transaction })
}

const updateByPaymentId = async (payment_id, data, transaction = null) => {
    await Models.update(data, { where: { payment_id }, transaction })
    return await Models.findOne({ where: { payment_id }})
}

module.exports = {
    findAll,
    findOne,
    create,
    update,
    updateByPaymentId,
    findAndCountAll,
    getRawList,
    getMetaData
}
