const { Router } = require('express')
const { check } = require('express-validator')

const { crudValidator, validateJWT, isAdminRole } = require('../middlewares')

const {
    getAllServiceType,
    storeServiceType,
    getServiceTypeByID,
    updateServiceType,
    deleteServiceType,
} = require('../controllers/services/service-type.controller')

const { serviceTypeExists } = require('../helpers/db-validators')

const ServiceType = require('../models/services/service-type.model')
const { paginatedResults } = require('../helpers/paginator')

const router = Router()

router.post('/all', [], getAllServiceType)

router.post(
    '/:id',
    [
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(serviceTypeExists),
    ],
    getServiceTypeByID
)

router.post(
    '/',
    [
        validateJWT,
        isAdminRole,
        check('name', 'El nombre no puede estar vacío').notEmpty(),
        check('duration', 'La duración debe ser un número válido.').isNumeric(),
        crudValidator,
    ],
    storeServiceType
)

router.put(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('name', 'El nombre no puede estar vacío').notEmpty(),
        crudValidator,
    ],
    updateServiceType
)

router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(serviceTypeExists),
        crudValidator,
    ],
    deleteServiceType
)

module.exports = router
