const { request, response } = require("express");
const debug = require("../../utils/debug");

const ServiceType = require("../../models/services/service-type.model");
const { success, error } = require("../../helpers");

const getAllServiceType = async (req = request, res = response) => {
  const service_types = await ServiceType.find({ status: true });
  res.json(success("ok", service_types, res.statusCode));
};

const getServiceTypeByID = (req = request, res = response) => {
  const { id } = req.params;

  res.json({ id });
};

const storeServiceType = async (req = request, res = response) => {
  const { duration, name } = req.body;

  const payload = {
    name: name.toUpperCase(),
    user: req.user.id,
    duration,
  };

  const alreadyExists = await ServiceType.findOne({ name: name.toUpperCase() });

  if (alreadyExists) {
    return res.json(
      error(`Ya existe el tipo de servicio con nombre ${name}!`, res.statusCode)
    );
  }

  const service_type = await ServiceType.create(payload);

  res.json(success("ok", { ...service_type }, res.statusCode));
};

const updateServiceType = (req = request, res = response) => {
  const { id } = req.params;

  res.json(success("ok", { id }, res.statusCode));
};

const deleteServiceType = async (req = request, res = response) => {
  const { id } = req.params;

  const service_type = await ServiceType.findByIdAndUpdate(
    id,
    {
      status: false,
    },
    { new: true }
  );

  res.json(success("ok", { service_type }, res.statusCode));
};

module.exports = {
  getAllServiceType,
  storeServiceType,
  deleteServiceType,
  updateServiceType,
  getServiceTypeByID,
};
