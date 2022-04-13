const crudValidator = require('./crud-validators')
const jwtValidator = require('./jwt-validator')
const roleValidator = require('./validate-roles')


module.exports = {
    ...crudValidator,
    ...jwtValidator,
    ...roleValidator
}