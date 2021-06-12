module.exports = {
    transform: (payloads) => {
        console.log(payloads[0])
        return payloads.map(payload => {
            return {
                id: payload.id,
                name: payload.user.name,
                product: payload.pp_name.includes('POSTPAID') ? payload.pp_name.replace('POSTPAID', 'Pasca Bayar') : payload.pp_name,
                provider: payload.pp_provider,
                category: payload.pp_category,
                transaction_status: payload.status,
                payment_status: payload.pa_status,
                category: payload.pp_category,
                expired_at: payload.pa_expired_at
            }
        }) 
    }
}