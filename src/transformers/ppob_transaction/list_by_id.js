module.exports = {
    transform: (payloads) => {
        return payloads.map(payload => {
            return {
                id: payload.id,
                product: payload.pp_name.includes('POSTPAID') ? payload.pp_name.replace('POSTPAID', 'Pasca Bayar') : payload.pp_name,
                provider: payload.pp_provider,
                destination_number: payload.destination_number.includes(':') ? payload.destination_number.split(':')[1] : payload.destination_number,
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