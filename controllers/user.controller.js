const { response, request } = require("express");

const bcryptjs = require("bcryptjs");
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
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

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

const userPut = (req = request, res) => {
  const { id } = req.params;

  res.json({
    ok: true,
    msg: "put API - controlador",
    id,
  });
};

const userDelete = (req, res) => {
  res.json({
    ok: true,
    msg: "delete API - controlador",
  });
};

const userPatch = (req, res) => {
  res.json({
    ok: true,
    msg: "patch API - controlador",
  });
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete,
  userPatch,
};
