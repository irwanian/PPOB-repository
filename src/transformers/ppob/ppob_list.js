module.exports = {
    transform: (payloads) => {
        return payloads.map(payload => {
            if (payload.is_active === 1) {
                return {
                    id: payload.id,
                    name: payload.name,
                    provider: payload.provider,
                    category: payload.category,
                    denom: payload.denom,
                    selling_price: payload.selling_price,
                    description: payload.description,
                }
            }
        }) 
    }
}