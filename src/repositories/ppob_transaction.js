const Models = require('../models').ppob_transaction

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
    updateByPaymentId
}
