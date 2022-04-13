const bcryptjs = require("bcryptjs");

const Role = require("../models/role");
const User = require("../models/user.model");

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

const userExists = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const exists = await User.findById(id);
    if (!exists) {
      throw new Error(`El usuario con id: '${id}', no existe.`);
    }
  }
};

const hashPassword = (pwd) => bcryptjs.hashSync(pwd, bcryptjs.genSaltSync());

module.exports = {
  isValidRole,
  emailExists,
  hashPassword,
  userExists,
};
