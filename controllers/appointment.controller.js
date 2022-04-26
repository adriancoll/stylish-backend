const { response } = require("express");
const { request } = require("express");
const debug = require("../utils/debug");

// Models
const { Appointment } = require("../models");
const { success, error } = require("../helpers");

const storeAppointment = async (req = request, res = response) => {
  const {} = req.body;

  const appointment = await Appointment.findOne({});

  res.json(success("ok", { appointment }, res.statusCode));
};

const deleteAppointment = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndUpdate(id, {
      status: "CANCELLED",
    });

    return res.status(200).json(success("ok", { appointment }, res.statusCode));
  } catch (ex) {
    debug("Ha habido un error al eliminar la reserva.", "error");
    return res.json(
      error("Ha habido un error al eliminar la reserva.", {}, res.statusCode)
    );
  }
};

const getAllAppointments = async (req = request, res = response) => {
  const appointments = await Appointment.find();

  res.json(appointments);
};

const confirmAppointment = async (req = request, res = response) => {
  const { id } = req.params;

  const appointment = await Appointment.findOneAndUpdate(
    id,
    {
      status: "CONFIRMED",
    },
    {
      new: true,
    }
  );

  res.json({ appointment });
};

const updateAppointment = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, ...data } = req.body;

  const appointment = await Appointment.findOneAndUpdate(id, data, {
    new: true,
  });

  res.json({ appointment });
};

module.exports = {
  storeAppointment,
  deleteAppointment,
  getAllAppointments,
  confirmAppointment,
  updateAppointment,
};
