const bcrypt = require('bcryptjs')
const { request, response } = require('express')
const { generateJWT } = require('../helpers/generate-jwt')
const { googleVerify } = require('../helpers/google-verify')
const debug = require('../utils/debug')

const User = require('../models/user.model')
const Business = require('../models/business.model')
const Appointment = require('../models/appointment.model')
const { error, success } = require('../helpers')
const { parseMyAppointments } = require('../helpers/appontment-helper')

const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body

    // validate if already registered
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      res
        .status(400)
        .json(
          error(
            'Usuario o contraseña incorrectos inténtalo de nuevo.',
            res.statusCode
          )
        )
      return
    }

    if (!user.status) {
      res
        .status(400)
        .json(
          error(
            'El usuario con el que intentas entrar ha sido bloqueado. Contacta con un administrador.',
            res.statusCode
          )
        )
      return
    }

    // Validar password
    const validPassword = await bcrypt.compareSync(password, user.password)

    if (!validPassword) {
      res
        .status(400)
        .json(
          error(
            'Usuario o contraseña incorrectos inténtalo de nuevo.',
            res.statusCode
          )
        )
      return
    }

    // Generate JWT
    const [token, business] = await Promise.all([
      generateJWT(user.id),
      Business.findOne({ user: user.id }).populate(
        'service_types',
        '-user -__v'
      ),
    ])

    if (business) {
      let appointments = await Appointment.find({ business: business._id })
        .deepPopulate('business.service_types, business.user')
        .sort({ date: 'desc' })

      appointments = parseMyAppointments(appointments)

      return res.json(
        success(
          'ok',
          {
            business,
            appointments,
            user,
            token,
          },
          res.statusCode
        )
      )
    }

    let appointments = await Appointment.find({ user: user.id })
      .deepPopulate('business.service_types, business.user')
      .sort({ date: 'desc' })

    appointments = parseMyAppointments(appointments)

    return res.json(
      success(
        'ok',
        {
          user,
          token,
          appointments,
        },
        res.statusCode
      )
    )
  } catch (ex) {
    debug(ex, 'error')
    res
      .status(500)
      .json(error('Ha habido un error desconocido.', res.statusCode))
  }
}

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body

  try {
    const { name, email, image } = await googleVerify(id_token)

    let user = await User.findOne({ email })

    if (!user) {
      /**
       * @TODO Hacer formulario de contraseña y no dejar string
       */
      const data = {
        name,
        email,
        image,
        google: true,
        password: ':P',
      }

      user = new User(data)
      await user.save()
      debug(`Se ha creado el usuario ${email} a través de google.`, 'info')
    }

    // if user is bloqued
    if (!user.status) {
      return res.status(401).json({
        msg: 'Usuario bloqueado, habla con un administrador.',
      })
    }

    // Generate JWT
    const token = await generateJWT(user.id)

    res.json(
      success(
        'ok',
        {
          user,
          token,
        },
        res.statusCode
      )
    )
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: 'Ha habido un error al inicar sesión con google.',
    })
  }
}

const refreshToken = async (req = request, res = response) => {
  const { user } = req

  const payload = {
    user,
    token: req.refreshToken,
  }

  const business = await Business.findOne({ user: user.id }).populate(
    'service_types',
    '-user -__v'
  )

  if (business) {
    payload.appointments = await Appointment.find({ business: business._id })
      .deepPopulate('business.service_types, business.user')
      .sort({ date: 'desc' })
    payload.business = business
  } else {
    payload.appointments = await Appointment.find({ user: user.id })
      .deepPopulate('business.service_types, business.user')
      .sort({ date: 'desc' })
  }

  payload.appointments = parseMyAppointments(payload.appointments)

  return res.json(
    success('Usuario, Token renovado 😎', payload, res.statusCode)
  )
}

module.exports = {
  login,
  googleSignIn,
  refreshToken,
}
