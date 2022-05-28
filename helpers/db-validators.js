// Dependency Injection
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const moment = require('moment')
moment.locale('es')

// Models
const debug = require('../utils/debug')

const { Business, Role, User, Service_type } = require('../models')
const { isEmpty } = require('lodash')

/**
 * Middleware to check if the role name exists on database
 * @param {String} name name of the role to validate
 */
const isValidRole = async (name = '') => {
  if (name === 'ADMIN_ROLE') {
    throw new Error(
      `No se puede crear y/o actualizar un usuario con el rol ${name}.`
    )
  }

  const existeRol = await Role.findOne({ name })

  if (!existeRol) {
    throw new Error(`El rol '${name}' no está registrado en la base de datos.`)
  }
}

/**
 * Middleware to check if the email exists on database
 * @param {String} email to validate
 */
const emailExists = async (email = '') => {
  const existeEmail = await User.findOne({ email })

  if (existeEmail) {
    throw new Error(`El email '${email}', ya está registrado.`)
  }
}

/**
 * Middleware to check if the email exists on database
 * @param {String} email to validate
 */
const userWithPhoneExists = async (phone_number = '') => {
  const existePhoneNumber = await User.findOne({ phone_number })

  if (existePhoneNumber) {
    throw new Error(
      `El número de teléfono '${phone_number}', ya está registrado.`
    )
  }
}

/**
 * Middleware to check if the user exists on database
 * @param {Number} id id of the user to validate
 */
const userExists = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const exists = await User.findById(id)

    if (!exists || !exists.status) {
      debug(
        `El usuario con id: '${id}', no existe ó está deshabilitado.`,
        'error'
      )
      throw new Error(
        `El usuario con id: '${id}', no existe ó está deshabilitado.`
      )
    }
  }
}

/**
 * Middleware to check if the business exists on database, and user is not disabled
 * @param {Number} id id of the business to validate
 */
const businessExists = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const exists = await Business.findById(id).populate('user')

    if (!exists) {
      debug(
        `La empresa con id: '${id}', no existe ó está deshabilitado.`,
        'error'
      )
      throw new Error(
        `La empresa con id: '${id}', no existe ó está deshabilitado.`
      )
    }

    if (!exists.user) {
      debug(
        `El usuario vinculado con el negocio con id: '${id}', no existe ó está deshabilitado.`,
        'error'
      )
      throw new Error(
        `El usuario vinculado con el negocio con id: '${id}', no existe ó está deshabilitado.`
      )
    }
  }
}

/**
 * Middleware to check if the serviceType exists on database
 * @param {Number} id id of the business to validate
 */
const serviceTypeExists = async (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    // Yes, it's a valid ObjectId, proceed with `findById` call.
    const exists = await Service_type.findById(id)
    if (isEmpty(exists)) {
      debug('¡Se ha intentado modificar una categoría que no existe!', 'error')
      throw new Error(`El servicio con id: '${id}', no existe.`)
    }
  }
}

const isObjectIdArray = function (values) {
  let isObjectIds = true

  values.forEach(function (element) {
    if (!mongoose.Types.ObjectId.isValid(element)) {
      isObjectIds = false
    }
  })

  return isObjectIds
}

/**
 * Middleware to check if the date is granther than today's date
 * @param {Date} date Date of the appointment
 */
const appointmentDateValidator = (date) => {
  if (!moment(date).isValid()) {
    throw new Error('La fecha introducida es invalida.')
  }

  if (moment(date).isBefore(moment())) {
    debug('¡La fecha introducida es menor a hoy! '+ moment().diff(date, 'days'), 'error')
    throw new Error('La fecha introducida es menor a ahora.')
  }

  return moment(date)
}

const hashPassword = (pwd) => bcryptjs.hashSync(pwd, bcryptjs.genSaltSync())

module.exports = {
  isValidRole,
  emailExists,
  hashPassword,
  userExists,
  serviceTypeExists,
  businessExists,
  isObjectIdArray,
  userWithPhoneExists,
  appointmentDateValidator,
}
