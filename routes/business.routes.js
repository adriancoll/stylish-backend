const { Router } = require("express");
const { check } = require("express-validator");

const {
  getUserBusiness,
  storeBusiness,
  updateBusiness,
  getAllBusiness,
} = require("../controllers/business.controller");

const { userExists, businessExists, isObjectIdArray } = require("../helpers/db-validators");

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
    check("service_types", "Los tipos de servicios enviados no son válidos").optional().custom(isObjectIdArray),
    crudValidator,
  ],
  storeBusiness
);

router.post("/all", [], getAllBusiness);

router.post(
  "/:id",
  [
    validateJWT,  
    hasRole("BUSINESS_ROLE", "ADMIN_ROLE"),
    //url query
    check("id", "No es un id válido").isMongoId(),
    check("id", "No existe el negocio que estás intentandon editar.").custom(businessExists),
    //body
    check("user", "El usuario no existe o es un id inválido.").optional().isMongoId().custom(userExists),
    check("service_types", "Los tipos de servicios enviados no son válidos").optional().custom(isObjectIdArray),
    crudValidator,
  ],
  updateBusiness
);

module.exports = router;
