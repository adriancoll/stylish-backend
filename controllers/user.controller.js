const { response, request } = require("express");
const { hashPassword } = require("../helpers/db-validators");

const User = require("../models/user");

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
        user,
      });
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
    });
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

const userDelete = async (req = request, res = response) => {
  const { id } = req.params;

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
  });
};

module.exports = {
  userGet,
  userPost,
  userPut,
  userDelete,
};
