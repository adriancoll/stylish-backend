const { Router } = require("express");
const { check } = require("express-validator");
const { crudValidator } = require("../middlewares/crud-validators");

const {
  storeAppointment,
  confirmAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  getMyAppointments,
} = require("../controllers/appointment.controller");

const { hasRole, validateJWT, isAdminRole } = require("../middlewares");

const {
  businessExists,
  serviceTypeExists,
  userExists,
} = require("../helpers/db-validators");

const router = Router();

router.post(
  "/",
  [
    validateJWT,
    // hasRole("USER_ROLE", "ADMIN_ROLE"),
    check("business").isMongoId(),
    check("service_type").isMongoId(),

    check("business").custom(businessExists),
    check("service_type").custom(serviceTypeExists),

    check("observations").optional().isString(),
    crudValidator,
  ],
  storeAppointment
);

router.post(
  "/my",
  [
    validateJWT,
    check("business_id").optional().isMongoId(),
    check("business_id").optional().custom(businessExists),
    crudValidator,
  ],
  getMyAppointments
);

router.post(
  "/confirm/:id",
  [validateJWT, hasRole("BUSINESS_ROLE", "ADMIN_ROLE"), crudValidator],
  confirmAppointment
);

router.post("/all", [crudValidator], getAllAppointments);

router.put(
  "/:id",
  [validateJWT, hasRole("USER_ROLE", "ADMIN_ROLE"), crudValidator],
  updateAppointment
);

router.delete(
  "/:id",
  [validateJWT, isAdminRole, crudValidator],
  deleteAppointment
);

module.exports = router;
