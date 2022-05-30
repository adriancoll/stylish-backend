const { Router } = require('express')
const { check } = require('express-validator')
const { crudValidator } = require('../middlewares/crud-validators')

const {
  storeAppointment,
  confirmAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  getMyAppointments,
  getNextAppointment,
} = require('../controllers/appointment.controller')

const {
  hasRole,
  validateJWT,
  isAdminRole,
  checkAppointmentConflicts,
  isBodyEmpty,
} = require('../middlewares')

const {
  businessExists,
  serviceTypeExists,
  appointmentDateValidator,
} = require('../helpers')

const router = Router()

router.post(
  '/',
  [
    isBodyEmpty,
    validateJWT,
    hasRole("USER_ROLE", "ADMIN_ROLE"),
    check('business').isMongoId(),
    check('service_type').isMongoId(),
    check(
      'observations',
      "El campo de observaciones debe ser de tipo 'String'."
    )
      .optional()
      .isString(),

    check('business').custom(businessExists),
    check('service_type').custom(serviceTypeExists),
    check('date', 'La fecha introducida es inválida.').isISO8601().toDate(),
    check('date', 'La fecha introducida es menor a hoy.').custom(
      appointmentDateValidator
    ),

    crudValidator,
  ],
  storeAppointment
)

router.post(
  '/my',
  [
    validateJWT,
    check('business_id').optional().isMongoId(),
    check('business_id').optional().custom(businessExists),
    crudValidator,
  ],
  getMyAppointments
)

router.post(
  '/confirm/:id',
  [validateJWT, hasRole('BUSINESS_ROLE', 'ADMIN_ROLE'), crudValidator],
  confirmAppointment
)

router.post('/all', [crudValidator], getAllAppointments)

router.put(
  '/:id',
  [validateJWT, hasRole('USER_ROLE', 'ADMIN_ROLE'), crudValidator],
  updateAppointment
)

router.post(
  '/next',
  [validateJWT, crudValidator],
  getNextAppointment
)

router.delete('/:id', [validateJWT, crudValidator], deleteAppointment)

module.exports = router
