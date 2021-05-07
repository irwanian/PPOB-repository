const validate = (schema) => {
    return (req, res, next) => {
        const arguments = { ...req.body || null, ...req.params || null, ...req.query || null }
        const { error } = schema.validate(arguments)

        if (error) {
            res.error(error)
        }
        else {
            next()    
        }
    }
}

module.exports = {
    validate
}