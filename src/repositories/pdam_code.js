const Models = require('../models').pdam_code

const findAndCountAll = async (where = {}, offset = 1, limit = 20, order) => {
    return await Models.findAndCountAll({
        where,
        limit,
        offset,
        order
    })
}

const findAll = async (where = {}, offset = 1, limit = 20, order) => {
    return await Models.findAll({
        where,
        limit,
        offset,
        order
    })
}
const findOne = async (where = {}, transaction = null) => {
    return await Models.findOne({
        where,
        raw: true,
        transaction
    })
}

const bulkInsert = async (data) => {
    return await Models.bulkCreate(data)
}

const create = async (data) => {
    return await Models.create(data)
}

const update = async (id, data) => {
     await Models.update(data, { where: { id }})

     return await Models.findOne({ where: { id }})
}


module.exports = {
    findAndCountAll,
    findOne,
    bulkInsert,
    create,
    update,
    findAll
}