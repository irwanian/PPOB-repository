const moment = require('moment-timezone')

const convertDateFormat = ({ date, oldFormat, newFormat })  => {
    return moment(date, oldFormat).format(newFormat)
}

module.exports = {
    convertDateFormat
}