const bcryptjs = require("bcryptjs");
const Category = require("../models/services/service-type.model");

const Role = require("../models/role.model");
const User = require("../models/user.model");

const debug = require("../utils/debug");

/**
 * Middleware to check if the role name exists on database
 * @param {String} name name of the role to validate
 */
const isValidRole = async (name = "") => {
  if (name === "ADMIN_ROLE") {
    throw new Error(`No se puede crear un usuario con el rol ${name}.`);
  }

  const existeRol = await Role.findOne({ name });

  if (!existeRol) {
    throw new Error(`El rol '${name}' no está registrado en la base de datos.`);
  }
};

/**
 * Middleware to check if the email exists on database
 * @param {String} email to validate
 */
const emailExists = async (email = "") => {
  const existeEmail = await User.findOne({ email });

  if (existeEmail) {
    throw new Error(`El email '${email}', ya está registrado.`);
  }
};

/**
 * Middleware to check if the user exists on database
 * @param {Number} id id of the user to validate
 */
const userExists = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const exists = await User.findById(id);
    if (!exists || !exists.status) {
      debug(`El usuario con id: '${id}', no existe ó está deshabilitado.`, "error");
      throw new Error(`El usuario con id: '${id}', no existe ó está deshabilitado.`);
    }
  }
};

const serviceTypeExists = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const exists = await Category.findById(id);
    if (!exists) {
      debug("¡Se ha intentado modificat una categoría que no existe!", "error");
      throw new Error(`La categoría con id: '${id}', no existe.`);
    }
  }
};

const hashPassword = (pwd) => bcryptjs.hashSync(pwd, bcryptjs.genSaltSync());

module.exports = {
  isValidRole,
  emailExists,
  hashPassword,
  userExists,
  serviceTypeExists,
};
