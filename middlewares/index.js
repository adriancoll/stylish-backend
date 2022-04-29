const crudValidator        = require('./crud-validators')
const jwtValidator         = require('./jwt-validator')
const roleValidator        = require('./validate-roles')
const isBodyEmptyValidator = require('./body-empty')


module.exports = {
    ...crudValidator,
    ...jwtValidator,
    ...roleValidator,
    ...isBodyEmptyValidator,
}