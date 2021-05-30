const Models = require('../models').payment

const findAll = async (where = {}, offset = 1, limit = 20, order) => {
    return await Models.findAll({
        where,
        limit,
        offset,
        order,
    })
}

const findOne = async (where = {}) => {
    return await Models.findOne({
        where,
        raw: true
    })
}

const create = async (data, transaction) => {
    return await Models.create(data, { transaction })
}

const update = async (id, data, transaction) => {
     return await Models.update(data, { where: { id }, transaction })
}


module.exports = {
    findAll,
    findOne,
    create,
    update
}