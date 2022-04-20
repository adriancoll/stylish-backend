const { Router } = require("express");
const { check } = require("express-validator");
const { crudValidator } = require("../middlewares/crud-validators");

const { login, googleSignIn } = require("../controllers/auth.controller");

const router = Router();

router.post('/login', [
    check('email', 'El correo es obligatorio para iniciar sesión').isEmail().normalizeEmail(),
    check('password', 'Debes introducir una contraseña').not().isEmpty().trim(),
    crudValidator
], login)

router.post('/google', [
    check('id_token', 'El id_token es necesario para inicar sesión con google.').not().isEmpty(),
    crudValidator
], googleSignIn)


module.exports = router;