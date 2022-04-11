const Role = require("../models/role");
const User = require("../models/user");

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

const emailExists = async (email = "") => {
  const existeEmail = await User.findOne({ email });

  if (existeEmail) {
    throw new Error(`El email '${email}', ya está registrado.`);
  }
};

module.exports = {
  isValidRole,
  emailExists,
};
