const { response, request } = require("express");
const { hashPassword } = require("../helpers/db-validators");
const path = require("path");

const User = require("../models/user.model");
const { fileUpload, success } = require("../helpers");
const { isEmpty } = require("lodash");

const userGet = async (req = request, res = response) => {
  const {
    options: { limit = 5, from = 0 },
  } = req.body;

  const query = { status: true };

  // Non blocking, executed simultaneously
  const [users, total] = await Promise.all([
    User.find(query).skip(Number(from)).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json(
    success(
      "OK",
      {
        total,
        users,
      },
      res.statusCode
    )
  );
};

const userPost = async (req = request, res = response) => {
  try {
    const { name, email, password, image, phone_number } = req.body;
    const role = isEmpty(req.body.role) ? "USER_ROLE" : req.body.role;	

    console.log("test de body - ", req.body)
    const user = new User({
      name,
      email,
      role,
      password,
      image,
      phone_number,
    });

    // Hashear contraseña
    user.password = hashPassword(password);

    // Guardar en BD
    const savedUser = await user.save();
    res.status(201).json(
      success(
        "Usuario creado",
        {
          user: savedUser,
        },
        res.statusCode
      )
    );
  } catch (error) {
    res.json(
      error(
        "Error al crear usuario",
        {
          ok: false,
          error,
        },
        res.statusCode
      )
    );
  }
};

const userUpdate = async (req = request, res = response) => {
  let user;

  const { id } = req.params;

  // Defragment for excluding form normal validation
  const { _id, password, google, email, image, ...other } = req.body;

  if (req.files && Object.keys(files).length > 0) {
    const imagePath = await fileUpload(req.files);
    user = await User.findByIdAndUpdate(
      id,
      { image: imagePath },
      { new: true }
    );
  }

  // If wants to change it's password
  if (password) {
    other.password = hashPassword(password);
  }

  // get the user and update
  user = await User.findByIdAndUpdate(id, other, { new: true });

  res.json(
    success(
      "OK",
      {
        user,
      },
      res.statusCode
    )
  );
};

const userDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  );

  res.json(success("Usuario eliminado", { user }, res.statusCode));
};

module.exports = {
  userGet,
  userPost,
  userUpdate,
  userDelete,
};
