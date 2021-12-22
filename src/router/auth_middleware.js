const axios = require('axios')
const Helpers = require('../utils/helpers')

module.exports = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.error({ code: 401, message: 'Token Tidak Valid' })
    }

    const token = req.headers.authorization
    
    try {
        let userData
        console.time('how long to get User detail')
        userData = await axios.get(`${process.env.API_URL}/${req.body.user_id ? req.body.user_id : req.params.id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        })
        console.timeEnd('how long to get User detail')

        userData = Helpers.parseDataObject(userData.data.data)

        const { name, email, phone, slug } = userData
    
        req.session = {
            name,
            email,
            phone,
            slug
        }

        next()
    } catch (error) {
        return res.error({ message: error.response ? error.response.data.message : error.message, code: error.response.status || 500 })        
    }
}