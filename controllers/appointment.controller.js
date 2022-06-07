const { response } = require("express");
const { request } = require("express");
const schedule = require("node-schedule");
const debug = require("../utils/debug");

// Models
const { Appointment, Service_type, Business } = require("../models");
const { success, error } = require("../helpers");
const { isEmpty } = require("lodash");
const moment = require("moment");
const { parseMyAppointments } = require("../helpers/appontment-helper");

const storeAppointment = async (req = request, res = response) => {
  const { body, user } = req;
  const { business, service_type, observations, date, ...other } = body;

  const appointmentExist = await Appointment.findOne({
    user: user._id,
    business,
    service_type,
    date,
    status: {
      $in: ["PENDING_CONFIRM", "CONFIRMED"],
    },
  });

  if (!isEmpty(appointmentExist)) {
    return res.status(400).json(error("Reserva duplicada", res.statusCode));
  }

  const { duration } = await Service_type.findById(service_type);

  const appointment = await Appointment.create({
    business,
    date,
    service_type,
    observations: isEmpty(observations) ? "" : observations.trim(),
    user,
    end_date: moment(date).add(duration, "m"),
    ...other,
  }).deepPopulate("business.service_types, business.user");

  // Schedule job to confirm appointment on time
  const rule = new schedule.RecurrenceRule();

  rule.year = moment(appointment.end_date).year();
  rule.month = moment(appointment.end_date).month();
  rule.date = moment(appointment.end_date).date();
  rule.hour = moment(appointment.end_date).hours();
  rule.minute = moment(appointment.end_date).minutes();
  rule.second = moment(appointment.end_date).seconds();
  rule.tz = "Europe/Madrid";

  schedule.scheduleJob(rule, async () => {
    debug(
      `Checking if the appointment ${appointment._id} is completed`,
      "info"
    );

    if (appointment.status === "PENDING_CONFIRM") {
      debug("THE APPOINTMENT HAS TIMED OUT, CANCELING IT ...", "warning");
      appointment.status = "TIMEOUT";
      await appointment.save();
      return;
    }

    debug(
      `The ${appointment._id} appointment was  completed successfully.`,
      "info"
    );
  });

  return res.json(success("ok", { appointment }, res.statusCode));
};

const deleteAppointment = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: "CANCELED",
      },
      { new: true }
    );

    return res.status(200).json(success("ok", { appointment }, res.statusCode));
  } catch (ex) {
    debug("Ha habido un error al eliminar la reserva.", "error");
    return res.json(
      error("Ha habido un error al eliminar la reserva.", res.statusCode)
    );
  }
};

const getAllAppointments = async (req = request, res = response) => {
  let appointments = await Appointment.find();

  appointments = parseMyAppointments(appointments);

  res.json(success("ok", { appointments }, res.statusCode));
};

const getMyAppointments = async (req = request, res = response) => {
  let appointments, payload;
  const { user } = req;
  const { id } = user;

  const isBusiness = user.role === "BUSINESS_ROLE";

  if (!isBusiness) {
    payload = { user: id };
  } else {
    const business = await Business.findOne({ user: id });
    payload = { business: business._id };
  }

  appointments = await Appointment.find(payload)
    .deepPopulate("business.service_types, business.user")
    .sort({ date: "desc" });

  appointments = parseMyAppointments(appointments);

  res.json(
    success(
      "ok",
      {
        appointments,
      },
      res.statusCode
    )
  );
};

const confirmAppointment = async (req = request, res = response) => {
  const { id } = req.params;

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: id,
      status: "PENDING_CONFIRM",
    },
    {
      status: "CONFIRMED",
    },
    {
      new: true,
    }
  );

  if (!appointment) {
    return res
      .status(400)
      .json(
        error("La reseva no existe, o ya ha sido confirmada", res.statusCode)
      );
  }

  res.json(success("ok", { appointment }, res.statusCode));
};

const completeAppointment = async (req = request, res = response) => {
  const { id } = req.params;

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: id,
      status: "CONFIRMED",
    },
    {
      status: "COMPLETED",
    },
    {
      new: true,
    }
  );

  if (!appointment) {
    return res
      .status(400)
      .json(
        error("La reseva no existe, o ya ha sido completada", res.statusCode)
      );
  }

  res.json(success("ok", { appointment }, res.statusCode));
};

const updateAppointment = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, ...data } = req.body;

  const appointment = await Appointment.findOneAndUpdate(id, data, {
    new: true,
  })
    .populate("user", "-password")
    .populate("business");

  res.json(
    success(
      "Reserva actualizada correctamente",
      { appointment },
      res.statusCode
    )
  );
};

const getNextAppointment = async (req = request, res = response) => {
  const { user } = req;

  const isoDate = moment();

  const isBusiness = user.role === "BUSINESS_ROLE";

  if (!isBusiness) {
    payload = { user: user._id };
  } else {
    const business = await Business.findOne({ user: user._id });
    payload = { business: business._id };
  }

  const appointment = await Appointment.findOne({
    ...payload,
    date: { $gte: isoDate },
    status: {
      $in: ["PENDING_CONFIRM", "CONFIRMED", "CANCELED"],
    },
  })
    .sort({ date: 1 })
    .deepPopulate("business.service_types, business.user");

  if (isEmpty(appointment)) {
    return res.status(201).json(success("No hay reservas", {}, res.statusCode));
  }

  res.json(success("ok", { appointment }, res.statusCode));
};

module.exports = {
  storeAppointment,
  deleteAppointment,
  getAllAppointments,
  confirmAppointment,
  updateAppointment,
  getMyAppointments,
  getNextAppointment,
  completeAppointment,
};
