module.exports ={
    getPpobList: require('./ppob_list'),
    insertPpobProducts: require('./insert_ppob'),
    requestPpobPrepaidTransaction: require('./prepaid_transaction_request'),
    requestPpobPostpaidTransaction: require('./postpaid_transaction_request'),
    inquiryPrepaidPln: require('./inquiry_prepaid_pln'),
    inquiryPostpaid: require('./inquiry_postpaid'),
    getPdamList: require('./list_pdam'),
    checkTransactionStatus: require('./check_transaction_status')
} 