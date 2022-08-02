const { Router } = require('express')
const { check } = require('express-validator')

const {
    userGet,
    userPost,
    userDelete,
    userUpdate,
} = require('../controllers/user.controller')

const {
    isValidRole,
    emailExists,
    userExists,
    userWithPhoneExists,
} = require('../helpers/db-validators')

const {
    crudValidator,
    isAdminRole,
    validateJWT,
    hasRole,
} = require('../middlewares')

const router = Router()

router.post('/all', userGet)

router.post(
    '/:id',
    [
        validateJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(userExists),
        check('role').custom(isValidRole).optional(),
        check('phone_number', 'El número de teléfono no es válido.')
            .isString()
            .optional(),
        crudValidator,
    ],
    userUpdate
)

router.post(
    '/',
    [
        check('name', 'El nombre es obligatorio.').notEmpty(),
        check('email', 'El correo no es válido.').isEmail(),
        check('email').custom(emailExists),
        check('phone_number', 'El número de teléfono no es válido.').isString(),
        check('phone_number').custom(userWithPhoneExists),
        check('password', 'La contraseña debe tener más de 6 letras.').isLength(
            {
                min: 6,
            }
        ),
        check('role').custom(isValidRole).optional(),
        crudValidator,
    ],
    userPost
)

router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(userExists),
        crudValidator,
    ],
    userDelete
)

module.exports = router
