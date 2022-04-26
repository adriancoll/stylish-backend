const { response, request } = require('express')
const { isObjectIdArray } = require('../helpers/db-validators')
const debug = require('../utils/debug')

const Business = require('../models/business.model')
const User = require('../models/user.model')

const { error, success, fileUpload } = require('../helpers')

const getUserBusiness = async (req = request, res = response) => {
  const query = { user: req.user.id, status: true }

  try {
    const business = await Business.findOne(query)
      .populate('user', '-password -__v')
      .populate('service_types', '-user -__v')

    if (!business) {
      return res
        .status(401)
        .json(error('No tienes un negocio asociado', {}, res.statusCode))
    }

    res.json(success('OK', { business }, res.statusCode))
  } catch (e) {
    res
      .status(500)
      .json(
        error(
          'Error inesperado, el usuario no dispone de una empresa.',
          {},
          res.statusCode
        )
      )
  }
}

const storeBusiness = async (req = request, res = response) => {
  const { name, image, user_id, service_types } = req.body

  const userQuery = { status: true, role: 'BUSINESS_ROLE', _id: user_id }

  const [userHasRoleAndExists, exists] = await Promise.all([
    await User.findOne(userQuery),
    Business.findOne({ user: user_id }),
  ])

  if (!userHasRoleAndExists) {
    return res
      .status(401)
      .json(
        error(
          'El usuario no tiene un rol de empresa o no existe',
          {},
          res.statusCode
        )
      )
  }

  if (exists) {
    return res
      .status(401)
      .json(error('El usuario ya tiene un negocio', null, res.statusCode))
  }

  let business = await Business.create({
    name,
    image,
    user: user_id,
    service_types,
  })

  business = await Business.findById(business._id).populate('user', '-password')

  res.json(
    success(
      'ok',
      {
        business,
      },
      res.statusCode
    )
  )
}

const updateBusiness = async (req = request, res = response) => {
  try {
    let business
    const { id } = req.params

    const { files } = req
    if (files && Object.keys(files).length > 0) {
      const imagePath = await fileUpload(files)
      business = await Business.findByIdAndUpdate(
        id,
        { image: imagePath },
        { new: true }
      )

      return res.json(
        success(
          'Se ha añadido la imágen correctamente',
          {
            business,
          },
          res.statusCode
        )
      )
    }

    const { service_types, ...data } = req.body

    /**
     * Clear duplicated values in case of API
     * bad usage of the user, maybe errors in frontend
     * just make a set of unique values
     */
    const $service_types = [...new Set(service_types)]

    business = await Business.findByIdAndUpdate(
      id,
      { ...data, service_types: $service_types },
      {
        new: true,
      }
    )

    if (business) {
      return res.json(
        success(
          'Negocio actualizado correctamente',
          {
            business,
          },
          res.statusCode
        )
      )
    }

    res
      .status(500)
      .json(error('Error al actualizar el negocio', {}, res.statusCode))
  } catch (e) {
    debug(e, 'error')
    res.json(error('Error al actualizar el negocio', {}, res.statusCode))
  }
}

const getAllBusiness = async (_req = request, res = response) => {
  const businesses = await Business.find()
    .populate('user', '-password -status -__v')
    .populate('service_types', '-user -status -__v')

  res.json(success('OK', businesses, res.statusCode))
}

module.exports = {
  getUserBusiness,
  storeBusiness,
  updateBusiness,
  getAllBusiness,
}
