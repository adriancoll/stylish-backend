const { response, request } = require("express");
const { hashPassword } = require("../helpers/db-validators");

const User = require("../models/user");

const userGet = (req = request, res = response) => {
  const { nombre = "No Name", apikey, page = 1, limit = 10 } = req.query;

  res.json({
    ok: true,
    msg: "get API - controlador",
    nombre,
    apikey,
    page,
    limit,
  });
};

const userPost = async (req = request, res) => {
  try {
    const { name, email, role, password } = req.body;

    const user = new User({
      name,
      email,
      role,
      password,
    });

    // Hashear contraseña
    user.password = hashPassword(password);

    // Guardar en BD
    await user.save().then((user) => {
      res.status(201).json({
        ok: true,
        msg: "post API - controlador",
        user,
      });
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
    });
    console.log(error);
  }
};

const userPut = async (req = request, res = response) => {
  const { id } = req.params;

  // Defragment for excluding form normal validation
  const { _id, password, google, email, ...other } = req.body;

  // Wants to change it's own password
  if (password) {
    other.password = hashPassword(password);
  }

  // get the user and update
  const user = await User.findByIdAndUpdate(id, other, { new: true });

  res.json({
    user,
  });
};

const userDelete = (req = request, res = response) => {
  res.json({
    ok: true,
    msg: "delete API - controlador",
  });
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete,
};
