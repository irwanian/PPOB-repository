const getDestinationNumber = (destination_number, provider) => {
    let result
    
    if (provider === 'bpjs') {
        result = destination_number.split(':')[0]
    } else if (provider === 'pdam') {
        result = destination_number.split(':')[1]
    } else {
        result = destination_number
    }

    return result
}



module.exports = {
    transform: (payloads) => {
        return payloads.map(payload => {
            return {
                id: payload.id,
                product: payload.pp_name.includes('POSTPAID') ? payload.pp_name.replace('POSTPAID', 'Pasca Bayar') : payload.pp_name,
                provider: payload.pp_provider,
                destination_number: getDestinationNumber(payload.destination_number, payload.provider.toLowerCase()),
                category: payload.pp_category,
                transaction_status: payload.status,
                payment_status: payload.pa_status,
                category: payload.pp_category,
                expired_at: payload.pa_expired_at,
                price: payload.purchase_price - payload.pp_purchase_price,
                admin_fee: payload.pp_selling_price,
                total_price: payload.selling_price
            }
        }) 
    }
}