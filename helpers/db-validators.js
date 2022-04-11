const Role = require("../models/role");

/**
 * Middleware to check if the role name exists on database
 * @param {String} name name of the role to validate
 */
const isValidRole = async (name = "") => {
  const existeRol = await Role.findOne({ name });

  if (!existeRol) {
    throw new Error(`El rol ${name} no está registrado en la base de datos.`);
  }
};

module.exports = {
  isValidRole,
};
