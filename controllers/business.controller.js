const { response, request } = require("express");
const { isObjectIdArray } = require("../helpers/db-validators");
const debug = require("../utils/debug");

const Business = require("../models/business.model");
const User = require("../models/user.model");

const { error, success } = require("../helpers");

const getUserBusiness = async (req = request, res = response) => {
  const query = { user: req.user.id, status: true };

  try {
    const business = await Business.findOne(query)
      .populate("user", "-password -__v")
      .populate("service_types", "-user -__v");

    if (!business) {
      return res.status(401).json(error("No tienes un negocio asociado"));
    }

    res.json(success("ok", { business }, res.statusCode));
  } catch (e) {
    res
      .status(500)
      .json(
        error(
          "Error inesperado, el usuario no dispone de una empresa.",
          {},
          res.statusCode
        )
      );
  }
};

const storeBusiness = async (req = request, res = response) => {
  const { name, image, user_id, service_types } = req.body;

  const userQuery = { status: true, role: "BUSINESS_ROLE", _id: user_id };

  const [userHasRoleAndExists, exists] = await Promise.all([
    await User.findOne(userQuery),
    Business.findOne({ user: user_id }),
  ]);

  if (!userHasRoleAndExists) {
    return res.status(401).json({
      ok: false,
      msg: "El usuario no tiene un rol de empresa o no existe",
    });
  }

  if (exists) {
    return res.status(401).json(error("El usuario ya tiene un negocio", null ,res.statusCode));
  }

  let business = await Business.create({
    name,
    image,
    user: user_id,
    service_types,
  });

  business = await Business.findById(business._id).populate(
    "user",
    "-password"
  );

  res.json({
    ok: true,
    business,
  });
};

const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;

    const { service_types, ...data } = req.body;

    /**
     * Clear duplicated values in case of API
     * bad usage of the user, maybe errors in frontend
     * just make a set of unique values
     */
    const $service_types = [...new Set(service_types)];

    const business = await Business.findByIdAndUpdate(
      id,
      { ...data, service_types: $service_types },
      {
        new: true,
      }
    );

    if (business) {
      return res.json({
        ok: true,
        msg: "Negocio actualizado correctamente",
        business,
      });
    }

    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el negocio",
    });
  } catch (e) {
    debug(e, "error");
  }
};

const getAllBusiness = async (_req, res) => {
  const businesses = await Business.find()
    .populate("user", "-passowrd -__v")
    .populate("service_types", "-user -__v");

  res.json(businesses);
};

module.exports = {
  getUserBusiness,
  storeBusiness,
  updateBusiness,
  getAllBusiness,
};
