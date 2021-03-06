const { response, request } = require('express')
const { hashPassword } = require('../helpers/db-validators')

const cloudinary = require('cloudinary')

const User = require('../models/user.model')
const { success, error } = require('../helpers')
const { isEmpty } = require('lodash')

const userGet = async (req = request, res = response) => {
    const {
        options: { limit = 5, from = 0 },
    } = req.body

    const query = { status: true }

    // Non blocking, executed simultaneously
    const [users, total] = await Promise.all([
        User.find(query).skip(Number(from)).limit(Number(limit)),
        User.countDocuments(query),
    ])

    return res.json(
        success(
            'OK',
            {
                total,
                users,
            },
            res.statusCode
        )
    )
}

const userPost = async (req = request, res = response) => {
    try {
        const { name, email, password, image, phone_number } = req.body
        const role = isEmpty(req.body.role) ? 'USER_ROLE' : req.body.role

        const user = new User({
            name,
            email,
            role,
            password,
            image,
            phone_number,
        })

        // Hashear contraseña
        user.password = hashPassword(password)

        // Guardar en BD
        const savedUser = await user.save()
        return res.status(201).json(
            success(
                'Usuario creado correctamente',
                {
                    user: savedUser,
                },
                res.statusCode
            )
        )
    } catch (err) {
        return res.json(
            error(
                'Error al crear usuario',
                {
                    ok: false,
                    err,
                },
                res.statusCode
            )
        )
    }
}

const userUpdate = async (req = request, res = response) => {
    let user

    const { id } = req.params

    // Defragment for excluding form normal validation
    const {
        _id,
        password,
        google: _google,
        email: _email,
        phone_number,
        image: _image,
        ...other
    } = req.body

    /**
     * Documentacion de cloudinary
     * @url https://cloudinary.com/documentation/node_image_and_video_upload
     * */
    if (req.files && Object.keys(req.files).length > 0) {
        try {
            const { tempFilePath } = req.files.file
            const { secure_url } = await cloudinary.v2.uploader.upload(
                tempFilePath
            )

            user = await User.findByIdAndUpdate(id, {
                image: secure_url,
            })
        } catch (ex) {
            return res.json(
                error(
                    'No se ha podido actualizar tu imágen, contacta a un administrador',
                    500,
                    ex
                )
            )
        }
    }

    // If wants to change it's password
    if (!isEmpty(password)) {
        other.password = hashPassword(password)
    }

    // If wants to change it's mobile phone
    if (phone_number) {
        // validate if already assigned to another user

        const exists = await User.findOne({
            phone_number,
        })

        if (!exists) {
            other.phone_number = phone_number
        }
    }

    // get the user and update
    user = await User.findByIdAndUpdate(id, other, { new: true })

    res.json(
        success(
            'Usuario editado correctamente.',
            {
                user,
            },
            res.statusCode
        )
    )
}

const userDelete = async (req = request, res = response) => {
    const { id } = req.params

    const user = await User.findByIdAndUpdate(
        id,
        {
            status: false,
        },
        { new: true }
    )

    res.json(success('Usuario eliminado', { user }, res.statusCode))
}

module.exports = {
    userGet,
    userPost,
    userUpdate,
    userDelete,
}
