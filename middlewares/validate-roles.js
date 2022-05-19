const { request, response } = require("express");
const { error } = require("../helpers");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "¡Se ha intentado verificar el rol sin usuario, debe estar en una protegida por token JWT, revisa las rutas!",
    });
  }

  const { role } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res
      .status(401)
      .json(error(`${req.user.name} no es administrador.`, res.statusCode));
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res
        .status(500)
        .json(
          error(
            "¡Se ha intentado verificar el rol sin usuario, debe estar en una protegida por token JWT, revisa las rutas!",
            res.statusCode
          )
        );
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(401)
        .json(error(`¡No tienes el rol: ${roles.join(", ")}!`, res.statusCode));
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
