const { response } = require('express')
const { request } = require('express')
const schedule = require('node-schedule')
const debug = require('../utils/debug')

// Models
const { Appointment, Service_type } = require('../models')
const { success, error } = require('../helpers')
const { isEmpty } = require('lodash')
const moment = require('moment')
const { check } = require('prettier')

const storeAppointment = async (req = request, res = response) => {
  const { body, user } = req
  const { business, service_type, date, ...other } = body

  const appointmentExist = await Appointment.findOne({
    user: user._id,
    business,
    service_type,
    date,
    status: {
      $in: ['PENDING_CONFIRM', 'CONFIRMED'],
    },
  })

  if (!isEmpty(appointmentExist)) {
    return res.status(400).json(error('Reserva duplicada', res.statusCode))
  }

  const { duration } = await Service_type.findById(service_type)

  const appointment = await Appointment.create({
    business,
    date,
    service_type,
    user,
    end_date: moment(date).add(duration, 'm'),
    ...other,
  })

  const rule = new schedule.RecurrenceRule()

  rule.year = moment(date).year()
  rule.month = moment(date).month()
  rule.date = moment(date).date()
  rule.hour = moment(date).hours()
  rule.minute = moment(date).minutes()
  rule.second = moment(date).seconds()
  rule.tz = 'Europe/Madrid'

  schedule.scheduleJob(rule, async () => {
    debug(`Checking if the appointment ${appointment._id} is completed`, 'info')

    if (appointment.status === 'PENDING_CONFIRM') {
      debug('THE APPOINTMENT HAS TIMED OUT, CANCELING IT ...', 'warning')
      appointment.status = 'TIMEOUT'
      await appointment.save()
      return
    }

    debug(
      `The appointment was ${appointment._id} completed successfully.`,
      'info'
    )
  })

  res.json(success('ok', { appointment }, res.statusCode))
}

const deleteAppointment = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: 'CANCELED',
      },
      { new: true }
    )

    return res.status(200).json(success('ok', { appointment }, res.statusCode))
  } catch (ex) {
    debug('Ha habido un error al eliminar la reserva.', 'error')
    return res.json(
      error('Ha habido un error al eliminar la reserva.', res.statusCode)
    )
  }
}

const getAllAppointments = async (req = request, res = response) => {
  const appointments = await Appointment.find()

  res.json(success('ok', { appointments }, res.statusCode))
}

const getMyAppointments = async (req = request, res = response) => {
  let appointments

  const { business_id } = req.body

  if (!business_id) {
    const { id } = req.user
    appointments = await Appointment.find({ user: id })
  } else {
    appointments = await Appointment.find({
      business: business_id,
    })
  }

  const filteredAppointments = {
    PENDING_CONFIRM: appointments.filter(
      (appointment) => appointment.status === 'PENDING_CONFIRM'
    ),
    CONFIRMED: appointments.filter(
      (appointment) => appointment.status === 'CONFIRMED'
    ),
    COMPLETED: appointments.filter(
      (appointment) => appointment.status === 'COMPLETED'
    ),
    CANCELED: appointments.filter(
      (appointment) => appointment.status === 'CANCELED'
    ),
    TIMEOUT: appointments.filter(
      (appointment) => appointment.status === 'TIMEOUT'
    ),
  }

  res.json(
    success(
      'ok',
      {
        appointments: filteredAppointments,
      },
      res.statusCode
    )
  )
}

const confirmAppointment = async (req = request, res = response) => {
  const { id } = req.params

  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: id,
      status: 'PENDING_CONFIRM',
    },
    {
      status: 'CONFIRMED',
    },
    {
      new: true,
    }
  )

  if (!appointment) {
    return res
      .status(400)
      .json(
        error('La reseva no existe, o ya ha sido confirmada', res.statusCode)
      )
  }

  res.json(success('ok', { appointment }, res.statusCode))
}

const updateAppointment = async (req = request, res = response) => {
  const { id } = req.params
  const { status, ...data } = req.body

  const appointment = await Appointment.findOneAndUpdate(id, data, {
    new: true,
  })
    .populate('user', '-password')
    .populate('business')

  res.json(
    success(
      'Reserva actualizada correctamente',
      { appointment },
      res.statusCode
    )
  )
}

const getNextAppointment = async (req = request, res = response) => {
  const { user } = req

  const isoDate = moment()

  const appointment = await Appointment.findOne({
    user: user._id,
    date: { $gte: isoDate },
    status: {
      $in: ['PENDING_CONFIRM', 'CONFIRMED', 'CANCELED'],
    },
  })
  .sort({ date: 1 })

  if (isEmpty(appointment)) {
    return res.status(201).json(success('No hay reservas', {}, res.statusCode))
  }

  res.json(success('ok', { appointment }, res.statusCode))
}

module.exports = {
  storeAppointment,
  deleteAppointment,
  getAllAppointments,
  confirmAppointment,
  updateAppointment,
  getMyAppointments,
  getNextAppointment,
}
