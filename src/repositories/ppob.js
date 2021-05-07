const Models = require('../models').ppob_product

const findAndCountAll = async (where = {}, offset = 1, limit = 20, order) => {
    return await Models.findAndCountAll({
        where,
        limit,
        offset,
        order,
        logging: true
    })
}

const bulkInsert = async (data) => {
    return await Models.bulkCreate(data)
}

const insert = async (data) => {
    return await Models.insert(data)
}

const update = async (id, data) => {
     await Models.update(data, { where: { id }})

     return await Models.findOne({ where: { id }})
}


module.exports = {
    findAndCountAll,
    bulkInsert,
    insert,
    update
}