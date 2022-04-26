const { Router } = require('express')
const { check } = require('express-validator')
const { crudValidator } = require('../middlewares/crud-validators')

const { storeAppointment, confirmAppointment, getAllAppointments, updateAppointment, deleteAppointment } = require('../controllers/appointment.controller')
const { hasRole, validateJWT, isAdminRole } = require('../middlewares')

const router = Router()

router.post('/', [
    validateJWT,
    hasRole("USER_ROLE", "ADMIN_ROLE"),
    crudValidator
], storeAppointment)

router.post('/confirm/:id', [
    validateJWT,
    hasRole("BUSINESS_ROLE", "ADMIN_ROLE"),
    crudValidator
], confirmAppointment)

router.post('/all', [
    crudValidator
], getAllAppointments)

router.put('/:id', [
    validateJWT,
    hasRole("USER_ROLE", "ADMIN_ROLE"),
    crudValidator
], updateAppointment)

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    crudValidator
], deleteAppointment)



module.exports = router
