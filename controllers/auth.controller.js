const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/generate-jwt");

const User = require("../models/user.model");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate if already registered
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({
        msg: "Usuaraio o contraseña incorrectos inténtalo de nuevo.",
      });
      return;
    }

    if (!user.status) {
      res.status(400).json({
        msg: "El usuario con el que intentas entrar a sido bloqueado. Contacta con un administrador.",
      });
      return;
    }

    // Validar password
    const validPassword = await bcrypt.compareSync(
      password,
      user.password
    );

    if (!validPassword) {
      res.status(400).json({
        msg: "Usuaraio o contraseña incorrectos inténtalo de nuevo *",
      });
      return;
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token
    });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({
      msg: "Ha habido un error",
    });
  }
};

module.exports = {
  login,
};
