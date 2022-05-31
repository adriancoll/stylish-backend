const { Router } = require('express')
const { check } = require('express-validator')

const {
  getUserBusiness,
  storeBusiness,
  updateBusiness,
  getAllBusiness,
  addFeedback,
  getPopularBusiness,
  updateBusinessImage,
} = require('../controllers/business.controller')

const {
  userExists,
  businessExists,
  isObjectIdArray,
} = require('../helpers/db-validators')

const {
  validateJWT,
  crudValidator,
  hasRole,
  isBodyEmpty,
} = require('../middlewares')

const router = Router()

router.post(
  '/my',
  [validateJWT, hasRole('BUSINESS_ROLE'), crudValidator],
  getUserBusiness
)

router.post(
  '/',
  [
    validateJWT,
    check('user_id', 'No es un id válido').isMongoId(),
    check('user_id').custom(userExists),
    check('employees', 'El número de empleados es obligatorio.').isNumeric(),
    check('name', 'El nombre es obligatorio.').not().isEmpty(),
    check('description', 'La decripción es obligatoria, pero puede ser muy breve.').not().isEmpty(),
    check('latitude', 'La latitude es obligatoria.').isFloat({
      min: -90,
      max: 90,
    }),
    check('longitude', 'La longitude es obligatoria.').isFloat({
      min: -180,    
      max: 180,
    }),
    check('service_types', 'Los tipos de servicios enviados no son válidos')
      .optional()
      .custom(isObjectIdArray),
    crudValidator,
  ],
  storeBusiness
)

router.post('/all', [], getAllBusiness)

router.post(
  '/:id',
  [
    isBodyEmpty,
    validateJWT,
    hasRole('BUSINESS_ROLE', 'ADMIN_ROLE'),
    //url query
    check('id', 'No es un id válido').isMongoId(),
    check('id', 'No existe el negocio que estás intentandon editar.').custom(
      businessExists
    ),

    //body
    check('employees').optional().isNumeric(),
    check('user', 'El usuario no existe o es un id inválido.')
      .optional()
      .isMongoId()
      .custom(userExists),
    check('service_types', 'Los tipos de servicios enviados no son válidos')
      .optional()
      .custom(isObjectIdArray),
    crudValidator,
  ],
  updateBusiness
)


router.post(
  '/:id/image',
  [
    isBodyEmpty,
    validateJWT,
    hasRole('BUSINESS_ROLE', 'ADMIN_ROLE'),
    //url query
    check('id', 'No es un id válido').isMongoId(),
    check('id', 'No existe el negocio que estás intentandon editar.').custom(
      businessExists
    ),

    //body
    check('employees').optional().isNumeric(),
    check('user', 'El usuario no existe o es un id inválido.')
      .optional()
      .isMongoId()
      .custom(userExists),
    check('service_types', 'Los tipos de servicios enviados no son válidos')
      .optional()
      .custom(isObjectIdArray),
    crudValidator,
  ],
  updateBusinessImage
)


router.post(
  '/:id/feedback',
  [
    validateJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id', 'No existe el negocio que estás intentandon editar.').custom(
      businessExists
    ),
    check('stars', 'Número inválido!').isFloat({ min: 0, max: 5 }),
    crudValidator,
  ],
  addFeedback
)

router.post('/popular/all', [], getPopularBusiness)

module.exports = router
