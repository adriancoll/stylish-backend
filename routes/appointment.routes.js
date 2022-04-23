const { Router } = require('express')
const { check } = require('express-validator')
const { crudValidator } = require('../middlewares/crud-validators')

const { storeAppointment } = require('../controllers/appointment.controller')

const router = Router()

router.post('/', [
    crudValidator
], storeAppointment)

/*
router.post('/confirm/:id', {
    crudValidator
}, confirmAppointment)

router.post('/get-all', {
    crudValidator
}, getAllAppointments)

router.put('/:id', {
    crudValidator
}, updateAppointment)

router.delete('/:id', {
    crudValidator
}, deeteAppointment)
*/


module.exports = router
