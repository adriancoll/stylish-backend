const { Router } = require("express");
const { check } = require("express-validator");

const {
  userGet,
  userPut,
  userPost,
  userDelete,
} = require("../controllers/user.controller");

const {
  isValidRole,
  emailExists,
  userExists,
  userWithPhoneExists,
} = require("../helpers/db-validators");

const { crudValidator, isAdminRole } = require("../middlewares");

const router = Router();

router.post("/all", userGet);

router.put(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(userExists),
    check("role").custom(isValidRole).optional(),
    crudValidator,
  ],
  userPut
);

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio.").notEmpty(),
    check("email", "El correo no es válido.").isEmail(),
    check("email").custom(emailExists),
    check("phone_number", "El número de teléfono no es válido.").notEmpty().isMobilePhone(),
    check("phone_number").custom(userWithPhoneExists),
    check("password", "La contraseña debe tener más de 6 letras.").isLength({
      min: 6,
    }),
    check("role").custom(isValidRole),
    crudValidator,
  ],
  userPost
);

router.delete(
  "/:id",
  [
    isAdminRole,
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(userExists),
    crudValidator,
  ],
  userDelete
);

module.exports = router;
