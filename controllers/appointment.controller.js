const { response } = require("express");
const { request }  = require("express");
const debug        = require('../utils/debug');

// Models
const { Appointment } = require("../models");


const storeAppointment = async (req = request, res = response) => {
  const {} = req.body;

  const appointment = await Appointment.findOne({});

  res.json({ appointment });
};

const deleteAppointment = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    await Appointment.findByIdAndUpdate(id, {
      status: "CANCELLED",
    });
    
    return res.json({
      ok: true,
    });
  } catch (ex) {
    debug("Ha habido un error al eliminar la reserva.", "error");
    return res.json({
      ok: false,
      msg: "Ha habido un error al eliminar la reserva.",
    });
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
