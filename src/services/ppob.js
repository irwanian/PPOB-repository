const moment = require('moment-timezone')
const qs = require('qs')
const crypto = require('crypto')
const ApiDependency = require('../utils/api_dependency')
const PpobRepository = require('../repositories/ppob')
const { NARINDO_PASSWORD, NARINDO_USER_ID } = process.env

const setProviderName = (code) => {
    let provider

    if (code.toLowerCase().startsWith('ots')) {
        provider = 'Telkomsel'
    } else if (code.toLowerCase().startsWith('oxl')) {
        provider = 'XL'
    } else if (code.toLowerCase().startsWith('oi')) {
        provider = 'Indosat'
    } else if (code.toLowerCase().startsWith('otr') || code.toLowerCase().startsWith('oth')) {
        provider = 'Tri'
    } else if (code.toLowerCase().startsWith('osm')) {
        provider = 'Smart'
    }  else if (code.toLowerCase().startsWith('oa') || code.toLowerCase().startsWith('ob')) {
        provider = 'Axis'
    } else if (code.toLowerCase().startsWith('opln')) {
        provider = 'PLN'
    } else if (code.toLowerCase().startsWith('ogp')) {
        provider = 'Gopay'
    } else if (code.toLowerCase().startsWith('odn')) {
        provider = 'Dana'
    } else if (code.toLowerCase().startsWith('oov')) {
        provider = 'Ovo'
    }

    return provider
}

const setVendorCode = vendor => {
    let vencorCode
    
    if (vendor.toLowerCase() === 'narindo') {
        vencorCode = 'NR'
    }

    return vendorCode
}


const mapPpobProducts = (products, vendor) => {
    return products.map(product => {
        const purchase_price = Number(product['Price'].replace(/,/gi, ''))
        const selling_price = purchase_price + 500
        const vendorCode = setVendorCode(vendor)
        let category

        if (product['Category'] && (product['Category'].toLowerCase().includes('reguler') || product['Category'].toLowerCase().includes('regular'))) {
            category = 'Reguler'
        } else if (product['Product Name'].toLowerCase().includes('regular') || product['Product Name'].toLowerCase().includes('reguler')) {
            category = 'Reguler'
        } else if (!product['Category']) {
            category = product['Product Name'].split(' ')[0]
        } 
        else {
            category = 'Data'
        }


        return {
            code: `${vendorCode}-${product['Product Code']}`,
            denom: product['Denomination'] ? product['Denomination'].replace(/,/gi, '.') : product['Nominal'].replace(/,/gi, '.'),
            name: product['Product Name'],
            description: product['Description'],
            purchase_price,
            selling_price,
            category,
            is_active: 1,
            provider: setProviderName(product['Product Code'])
        }
    })
}


const insertProducts = async (products, vendor) => {
    try {
        const mappedProducts = mapPpobProducts(products, vendor)

        return await PpobRepository.bulkInsert(mappedProducts)
    } catch (error) {
        throw new Error(error.message)
    }
    
}

const setReqId = () => {
    return 'ppob-' + moment().format('YYYYMMDD') + String((Math.floor(Math.random() * 10000) + 1000))
}

const setTransactionSign = (params) => {
    const { reqId, msisdn, product } = params
    const sign = crypto
                    .createHash('sha1')
                    .update(reqId + msisdn + product + NARINDO_PREPAID_USER_ID + NARINDO_PREPAID_PASSWORD)
                    .toUpperCase()

    return sign
}

const processPrepaidTransaction = async (params) => {
    const reqId = setReqId()
    const sign = setTransactionSign(params)
    const queryParams = qs.stringify({ 
        reqid: reqId,
        msisdn: params.msisdn,
        product: params.productCode,
        userid: NARINDO_PREPAID_USER_ID,
        sign,
        mid: reqId
    })

    const result = await ApiDependency.buyPrepaidPpobProduct(queryParams)
    console.log(result.data)

    return result
}

module.exports = {
    insertProducts,
    processPrepaidTransaction
}