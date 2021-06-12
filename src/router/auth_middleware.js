const axios = require('axios')

module.exports = async (req, res, next) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        return res.error({ code: 401, message: 'Token Tidak Valid' })
    }

    const token = req.headers.authorization.replace('Bearer ', '')
    console.log({ token })
    try {
        const userData = await axios.get(`http://kartunet.id/user/${req.body.user_id}`, {
            headers: {
                Accept: 'application/json',
                Authorization: token
            }
        })

        console.log(userData.data)
    
        if (!userData) {
            return res.error({ code: 404, message: 'User Tidak Ditemukan' })
        }
    
        req.session = userData.data
    } catch (error) {
        console.log(error)
        return res.error({ message: error.response ? error.response.data.message : error.message, code: 500 })        
    }
    
    next()
}