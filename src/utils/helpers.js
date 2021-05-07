module.exports.parseDataObject = (data) => {
    return JSON.parse(JSON.stringify(data))
}

module.exports.offsetPagination = (page, limit) => {
    const pg = page ? Number(page) : 1
    const lm = limit ? Number(limit) : 20
    const offset = ((pg - 1) * lm)

    return offset || 0
}