const Models = require('../models').narindo_postpaid_inquiry

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

const create = async (data) => {
    return await Models.create(data)
}

const update = async (id, data) => {
     await Models.update(data, { where: { id }})

     return await Models.findOne({ where: { id }})
}


module.exports = {
    findAll,
    findOne,
    create,
    update
}