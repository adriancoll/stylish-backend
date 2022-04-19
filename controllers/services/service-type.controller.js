const { request, response } = require("express");
const debug = require("../../utils/debug");

const ServiceType = require("../../models/services/service-type.model");

const getAllServiceType = async (req = request, res = response) => {
  // change to middleware
  // const options = {
  //   status: true
  // }

  // const [service_types, total] = await Promise.all([
  //   await ServiceType.find(options).populate("user"),
  //   await ServiceType.count(options),
  // ]);

  res.json(res.paginatedResults);
};

const getServiceTypeByID = (req = request, res = response) => {
  const { id } = req.params;

  res.json({ id });
};

const storeServiceType = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const payload = {
    name,
    user: req.user.id,
  };

  const alreadyExists = await ServiceType.findOne({ name });

  if (alreadyExists) {
    return res.json({
      msg: `Ya existe el tipo de servicio con nombre ${name}!`,
    });
  }

  const service_type = new ServiceType(payload);

  await service_type.save();

  res.json({
    ok: true,
    service_type,
  });
};

const updateServiceType = (req = request, res = response) => {
  const { id } = req.params;

  res.json({ id });
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

  res.json({
    ok: true,
    service_type,
  });
};

module.exports = {
  getAllServiceType,
  storeServiceType,
  deleteServiceType,
  updateServiceType,
  getServiceTypeByID,
};
