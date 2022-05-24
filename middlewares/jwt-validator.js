const { response, request } = require('express')
const debug = require('../utils/debug')
const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const { error, generateJWT } = require('../helpers')

const tokenRefresh = async (req = request, res = response, next) => {
  const token = req.header('x-token')

  // No token sended
  if (!token) {
    return res
      .status(401)
      .json(
        error(
          'No hay ningún token en las cabeceras de la petición...',
          res.statusCode
        )
      )
  }

  try {
    // get uid from token if valid
    const { uid } = jwt.verify(token, process.env.JWTSECRET)

    // store the auth user on the request
    const user = await User.findById(uid)

    // validate if user is enabled
    if (!user) {
      return res
        .status(401)
        .json(
          error(
            'Error, el usuario asignado al token ha sido borrado.',
            res.statusCode
          )
        )
    }

    if (!user.status) {
      return res
        .status(401)
        .json(error('Token inválido, usuario desactivado.', res.statusCode))
    }

    const refreshToken = await generateJWT(user._id)
    
    req.user = user
    req.refreshToken = refreshToken

    next()
  } catch (ex) {
    // if jwt.verify() throws the error reject the request
    debug(ex.message, 'error')
    return res
      .status(401)
      .json(error('Token inválido o su sesión a expirado.', res.statusCode))
  }
}

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token')

  // No token sended
  if (!token) {
    return res
      .status(401)
      .json(
        error(
          'No hay ningún token en las cabeceras de la petición...',
          res.statusCode
        )
      )
  }

  try {
    // get uid from token if valid
    const { uid } = jwt.verify(token, process.env.JWTSECRET)

    // store the auth user on the request
    const user = await User.findById(uid)

    // validate if user is enabled
    if (!user) {
      return res
        .status(401)
        .json(
          error(
            'Error, el usuario asignado al token ha sido borrado.',
            res.statusCode
          )
        )
    }

    if (!user.status) {
      return res
        .status(401)
        .json(error('Token inválido, usuario desactivado.', res.statusCode))
    }

    req.user = user

    next()
  } catch (ex) {
    // if jwt.verify() throws the error reject the request
    debug(ex.message, 'error')
    return res
      .status(401)
      .json(error('Token inválido o su sesión a expirado.', res.statusCode))
  }
}

module.exports = {
  validateJWT,
  tokenRefresh,
}
