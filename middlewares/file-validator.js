const { request, response } = require('express')
const { error } = require('../helpers/api-response')

const fileValidator = (req = request, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        res.status(400).json(
            error('No se ha adjuntado ningún archivo.', res.statusCode)
        )
        return
    }

    next()
}

module.exports = {
    fileValidator,
}
