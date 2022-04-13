const { Router } = require("express");
const { check } = require("express-validator");
const { crudValidator } = require("../middlewares/crud-validators");

const { login } = require("../controllers/auth.controller");

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio para iniciar sesión').isEmail(),
    check('password', 'Debes introducir una contraseña').not().isEmpty(),
    crudValidator
], login)

module.exports = router;