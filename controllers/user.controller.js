const { response, request } = require("express");
const { hashPassword } = require("../helpers/db-validators");
const path = require("path");

const User = require("../models/user.model");
const { fileUpload } = require("../helpers");

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

  res.json({
    total,
    users,
  });
};

const userPost = async (req = request, res) => {
  try {
    const { name, email, role, password, image, phone_number } = req.body;

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
    res.status(201).json({
      ok: true,
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
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

  res.json({
    user,
  });
};

const userDelete = async (req = request, res = response) => {
  const { id } = req.params;

  const authUser = req.user;

  const user = await User.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  );

  res.json({
    ok: true,
    user,
    authUser,
  });
};

module.exports = {
  userGet,
  userPost,
  userUpdate,
  userDelete,
};
