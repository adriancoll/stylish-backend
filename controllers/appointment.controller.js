const { response } = require('express')
const { request } = require('express')
const debug = require('../utils/debug')

// Models
const { Appointment } = require('../models')
const { success, error } = require('../helpers')
const { isEmpty } = require('lodash')
const moment = require('moment')

const storeAppointment = async (req = request, res = response) => {
  const { body, user } = req
  const { business, service_type, date } = body

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

  /**
   *  validate if has any other appointment at the range of hours based in the service.duration
   * */
  const appointment = await Appointment.findOne({
    business,
    date,
  })

  console.log(appointment)

  res.json(success('ok', { appointment }, res.statusCode))
}

const deleteAppointment = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const appointment = await Appointment.findByIdAndUpdate(id, {
      status: 'CANCELLED',
    })

    return res.status(200).json(success('ok', { appointment }, res.statusCode))
  } catch (ex) {
    debug('Ha habido un error al eliminar la reserva.', 'error')
    return res.json(
      error('Ha habido un error al eliminar la reserva.', {}, res.statusCode)
    )
  }
}

const getAllAppointments = async (req = request, res = response) => {
  const appointments = await Appointment.find()

  res.json(appointments)
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
    CANCELLED: appointments.filter(
      (appointment) => appointment.status === 'CANCELLED'
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
    id,
    {
      status: 'CONFIRMED',
    },
    {
      new: true,
    }
  )

  res.json({ appointment })
}

const updateAppointment = async (req = request, res = response) => {
  const { id } = req.params
  const { status, ...data } = req.body

  const appointment = await Appointment.findOneAndUpdate(id, data, {
    new: true,
  })
    .populate('user', '-password')
    .populate('business')

  res.json({ appointment })
}

module.exports = {
  storeAppointment,
  deleteAppointment,
  getAllAppointments,
  confirmAppointment,
  updateAppointment,
  getMyAppointments,
}
