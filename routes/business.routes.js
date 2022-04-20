const { Router } = require("express");
const { check } = require("express-validator");

const {
  getUserBusiness,
  storeBusiness,
} = require("../controllers/business.controller");

const { userExists } = require("../helpers/db-validators");

const { validateJWT, crudValidator, hasRole } = require("../middlewares");

const router = Router();

router.post(
  "/my",
  [validateJWT, hasRole("BUSINESS_ROLE"), crudValidator],
  getUserBusiness
);

router.post(
  "/",
  [
    check("user_id", "No es un id válido").isMongoId(),
    check("user_id").custom(userExists),
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("image", "La imagen es obligatoria.").not().isEmpty(),
    crudValidator,
  ],
  storeBusiness
);

module.exports = router;
