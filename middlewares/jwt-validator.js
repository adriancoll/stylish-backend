const { response, request, json } = require("express");
const debug = require('../utils/debug')
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  // No token sended
  if (!token) {
    return res.status(401).json({
      msg: "No hay ningún token en la petición...",
    });
  }

  try {
    // get uid from token if valid
    const { uid } = jwt.verify(token, process.env.JWTSECRET);

    // store the auth user on the request
    const user = await User.findById(uid);

    // validate if user is enabled
    if (!user) {
      return res.status(401).json({
        msg: "Error, el usuario asignado al token ha sido borrado.",
      });
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "Token inválido, usuario desactivado.",
      });
    }

    req.user = user;

    next();
  } catch (ex) {
    // if jwt.verify() throws the error reject the request
    debug(ex.message, "error");
    return res.status(401).json({
      msg: "Token inválido o su sesión a expirado.",
    });
  }
};

module.exports = {
  validateJWT,
};
