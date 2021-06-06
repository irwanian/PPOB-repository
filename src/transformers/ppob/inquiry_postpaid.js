module.exports = {
    transform: (data) => {
        const splittedMessage = data.message.split('\n')
        return {
            customer_id: data.custid,
            customer_name: splittedMessage[2],
            power: splittedMessage[3]
        }
    }
}