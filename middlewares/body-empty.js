/**
 * Validate if body is not empty
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

const { request, response } = require('express')
const { isEmpty } = require('lodash')
const { error } = require('../helpers')

const isBodyEmpty = (req = request, res = response, next) => {
    if (isEmpty(req.body) && isEmpty(req.files)) {
        return res
            .status(400)
            .json(
                error('¡No se han enviado datos, ni archivos!', res.statusCode)
            )
    }

    next()
}

module.exports = {
    isBodyEmpty,
}
