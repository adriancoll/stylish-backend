const { validationResult } = require("express-validator");

const crudValidator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(401).json(errors);
  }

  // Si no hay errores pasamos al siguiente Middleware
  next();
};

module.exports = {
  crudValidator,
};
