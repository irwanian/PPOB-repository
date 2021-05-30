module.exports = {
    transform: (payloads) => {
        return payloads.map(payload => {
            if (payload.is_active === 1) {
                return {
                    id: payload.id,
                    name: payload.name
                }
            }
        }) 
    }
}