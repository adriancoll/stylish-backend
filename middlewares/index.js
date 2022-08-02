const crudValidator = require('./crud-validators')
const jwtValidator = require('./jwt-validator')
const roleValidator = require('./validate-roles')
const isBodyEmptyValidator = require('./body-empty')
const checkAppointmentConflicts = require('./appointment.middleware')

module.exports = {
    ...crudValidator,
    ...jwtValidator,
    ...roleValidator,
    ...isBodyEmptyValidator,
    ...checkAppointmentConflicts,
}
