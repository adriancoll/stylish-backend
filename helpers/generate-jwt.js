const jwt = require("jsonwebtoken");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    if (!process.env.JWTSECRET) {
      reject("No se a encontrado un la variable de entorno que contiene el JWTSecret...");
    }

    jwt.sign(
      payload,
      process.env.JWTSECRET,
      {
        expiresIn: "7d",
      },
      (err, token) => {
        if (err) {
          debug(err);
          reject("No se pudo generar el token");
          return;
        }

        resolve(token);
      }
    );
  });
};

module.exports = {
  generateJWT,
};
