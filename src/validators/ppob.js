const Joi = require('joi')

const schemas = {
    getPpobList: Joi.object().keys({
        limit: Joi.number().error(new Error('page must be integer >= 1')),
        page: Joi.number().error(new Error('limit must be integer >= 1')),
        category: Joi.string().error(new Error('category must be string')),
        id: Joi.string().error(new Error('id must be string')),
        provider: Joi.string().error(new Error('provider must be string')),
    }),
    getPpobDetail: Joi.object().keys({
        id: Joi.number().error(new Error('id must be integer >= 1'))
    }),
}

module.exports = schemas