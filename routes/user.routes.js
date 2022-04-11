const { Router } = require("express");
const { check } = require("express-validator");
const { crudValidator } = require("../middlewares/crud-validators");
const Role = require("../models/role");

const {
  userGet,
  userPut,
  userPost,
  userDelete,
  userPatch,
} = require("../controllers/user.controller");
const { isValidRole } = require("../helpers/db-validators");

const router = Router();

router.get("/", userGet);

router.put("/:id", userPut);

router.post(
  "/",
  [
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("password", "La contraseña debe tener más de 6 letras.").isLength({
      min: 6,
    }),
    check("role").custom(isValidRole),
    check("email", "El correo no es válido.").isEmail(),
    crudValidator,
  ],
  userPost
);

router.delete("/", userDelete);

router.patch("/", userPatch);

module.exports = router;
