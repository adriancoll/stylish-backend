const { response, request } = require('express')
const debug = require('../utils/debug')

const cloudinary = require('cloudinary')

const Business = require('../models/business.model')
const User = require('../models/user.model')
const { clearDuplicates } = require('../utils/functions')

const { error, success, fileUpload } = require('../helpers')
const { json } = require('express/lib/response')

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
  const { name, address, image, user_id, service_types, rating, ...other } = req.body

  const userQuery = { status: true, role: 'BUSINESS_ROLE', _id: user_id }

  const [userHasRoleAndExists, exists] = await Promise.all([
    User.findOne(userQuery),
    Business.findOne({ user: user_id }),
  ])

  if (exists) {
    return res
      .status(401)
      .json(error('El usuario ya tiene un negocio', null, res.statusCode))
  }

  if (!userHasRoleAndExists) {
    await User.findOneAndUpdate(
      { status: true, _id: user_id },
      {
        role: 'BUSINESS_ROLE',
      }
    )
  }

  const $service_types = clearDuplicates(service_types)

  let business = await Business.create({
    name,
    image,
    user: user_id,
    service_types: $service_types,
    ...other,
  })

  business = await Business.findById(business._id)
    .populate('user', '-password')
    .populate('service_types', '-user -status -__v')

  return res.json(
    success(
      'ok',
      {
        business,
      },
      res.statusCode
    )
  )
}

const updateBusinessImage = async (req = request, res = response) => {
  try {
    let business
    const { id } = req.params

    const { files } = req

    if (files && Object.keys(files).length > 0) {
      console.log(files)
      try {
        console.log(files)
        const { tempFilePath } = files.file
        const { secure_url } = await cloudinary.v2.uploader.upload(tempFilePath)

        business = await Business.findByIdAndUpdate(
          id,
          { image: secure_url },
          { new: true }
        )
          .populate('user', '-password')
          .populate('service_types', '-user -status -__v')

        return res
          .status(200)
          .json(
            success(
              'Imágen actualizada correctamente.',
              { business },
              res.statusCode
            )
          )
      } catch (ex) {
        console.log(ex)
        return res.json(
          error(
            'No se ha podido actualizar tu imágen, contacta a un administrador',
            500,
            ex
          )
        )
      }
    }

    return res
      .status(500)
      .json(error('Error al actualizar el negocio', {}, res.statusCode))
  } catch (e) {
    debug(e, 'error')
    return res.json(
      error(e ?? 'Error al actualizar el negocio', res.statusCode)
    )
  }
}

const updateBusiness = async (req = request, res = response) => {
  try {
    let business
    const { id } = req.params

    const { files, body } = req
    const { service_types, rating: _rating, ...data } = body

    if (files && Object.keys(files).length > 0) {
      console.log(files)
      try {
        console.log(files)
        const { tempFilePath } = files.file
        const { secure_url } = await cloudinary.v2.uploader.upload(tempFilePath)

        business = await Business.findByIdAndUpdate(
          id,
          { image: secure_url },
          { new: true }
        )

        if (!data)
          return res
            .status(200)
            .json(
              success(
                'Imágen actualizada correctamente',
                { business },
                res.statusCode
              )
            )
      } catch (ex) {
        console.log(ex)
        return res.json(
          error(
            'No se ha podido actualizar tu imágen, contacta a un administrador',
            500,
            ex
          )
        )
      }
    }

    /**
     * Clear duplicated values in case of API
     * bad usage of the user, maybe errors in frontend
     * just make a set of unique values
     */
    const $service_types = clearDuplicates(service_types)

    business = await Business.findByIdAndUpdate(
      id,
      {
        ...data,
        service_types: $service_types,
      },
      { new: true }
    )
      .populate('user', '-password -__v')
      .populate('service_types', '-user -__v')

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

    return res
      .status(500)
      .json(error('Error al actualizar el negocio', {}, res.statusCode))
  } catch (e) {
    debug(e, 'error')
    return res.json(
      error(e ?? 'Error al actualizar el negocio', res.statusCode)
    )
  }
}

const getAllBusiness = async (_req = request, res = response) => {
  const businesses = await Business.find()
    .populate('user', '-password -status -__v')
    .populate('service_types', '-user -status -__v')

  res.json(success('OK', businesses, res.statusCode))
}

const addFeedback = async (req = request, res = response) => {
  const { id } = req.params
  const { stars } = req.body

  const business = await Business.findById(id)

  if (!business) {
    return res
      .status(401)
      .json(error('No existe el negocio', {}, res.statusCode))
  }

  business.total_stars = business.total_stars + stars
  business.total_users_feedback = business.total_users_feedback + 1
  business.rating = business.total_stars / business.total_users_feedback

  await business.save()

  return res.json(success('OK', { business }, res.statusCode))
}

const getPopularBusiness = async (_req = request, res = response) => {
  const businesses = await Business.find()
    .populate('user', '-password -status -__v')
    .populate('service_types', '-user -status -__v')
    .sort([
      ['total_users_feedback', 'desc'],
      ['total_stars', 'desc'],
      ['rating', 'desc'],
    ])
    .limit(8)

  res.json(success('OK', businesses, res.statusCode))
}

module.exports = {
  getUserBusiness,
  storeBusiness,
  updateBusiness,
  getAllBusiness,
  addFeedback,
  getPopularBusiness,
  updateBusinessImage,
}
