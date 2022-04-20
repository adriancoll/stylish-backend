const { query } = require("express");
const { response, request } = require("express");

const Business = require("../models/business.model");
const User = require("../models/user.model");

const getUserBusiness = async (req = request, res = response) => {
  const query = { user: req.user.id, status: true };

  try {
    const business = await Business.findOne(query).populate('user');

    if (!business) {
      return res.status(401).json({
        ok: false,
        msg: "No tienes un negocio asociado",
      });
    }

    res.json({
      ok: true,
      business,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, el usuario no dispone de una empresa.",
    });
  }
};

const storeBusiness = async (req = request, res = response) => {
  const { name, image, user_id } = req.body;

  const userQuery = { status: true, role: "BUSINESS_ROLE", _id: user_id };
  const userHasRoleAndExists = await User.findOne(userQuery);

  if (!userHasRoleAndExists) {
    return res.status(401).json({
      ok: false,
      msg: "El usuario no tiene un rol de empresa o no existe",
    });
  }

  const exists = await Business.findOne({ user: user_id });

  if (exists) {
    return res.status(401).json({
      ok: false,
      msg: "El usuario ya tiene un negocio asociado",
    });
  }

  const business = await Business.create({
    name,
    image,
    user: user_id,
  });

  res.json({
    ok: true,
    business,
  });
};

module.exports = {
  getUserBusiness,
  storeBusiness,
};
