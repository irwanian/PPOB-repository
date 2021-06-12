const axios = require('axios')

module.exports = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.error({ code: 401, message: 'Token Tidak Valid' })
    }

    const token = req.headers.authorization
    
    try {
        const userData = await axios.get(`https://kartunet.id/api/user/${req.body.user_id ? req.body.user_id : req.params.id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        })

        const { id, name, email, phone, slug } = userData.data.data
    
        req.session = {
            name,
            email,
            phone,
            slug
        }

        next()
    } catch (error) {
        console.log(error)
        return res.error({ message: error.response ? error.response.data.message : error.message, code: error.response.status || 500 })        
    }
}