const { Router } = require('express')
const { check } = require('express-validator')
const { crudValidator } = require('../middlewares/crud-validators')

const router = Router()

router.post('/', {
    crudValidator
}, storeAppointment)

module.exports = router
