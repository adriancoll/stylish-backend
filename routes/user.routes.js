const { Router } = require("express");
const { check } = require("express-validator");
const { crudValidator } = require("../middlewares/crud-validators");
const Role = require("../models/role");

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
} = require("../helpers/db-validators");

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
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("password", "La contraseña debe tener más de 6 letras.").isLength({
      min: 6,
    }),
    check("email").custom(emailExists),
    check("role").custom(isValidRole),
    check("email", "El correo no es válido.").isEmail(),
    crudValidator,
  ],
  userPost
);

router.delete(
  "/:id",
  [
    check("id", "No es un id válido").isMongoId(),
    check("id").custom(userExists),
    crudValidator
  ],
  userDelete
);

module.exports = router;
