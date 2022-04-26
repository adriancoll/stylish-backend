const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  console.log(req.user)
  if (!req.user) {
    return res.status(500).json({
      msg: "¡Se ha intentado verificar el rol sin usuario, debe estar en una protegida por token JWT, revisa las rutas!",
    });
  }

  const { role } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${req.user.name} no es administrador.`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "¡Se ha intentado verificar el rol sin usuario, debe estar en una protegida por token JWT, revisa las rutas!",
      });
    }

    console.log(roles.includes('ADMIN_ROLE'), roles)

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `¡No tienes el rol: ${roles.join(', ')}!`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
