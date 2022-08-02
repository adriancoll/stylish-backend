const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio.'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.'],
        select: false,
    },
    image: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE', 'BUSINESS_ROLE'],
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
})

// Modify the model we get when we query any user to abstract some useless data for frontend
UserSchema.methods.toJSON = function () {
    const { __v, password: _password, _id, ...user } = this.toObject()
    user.uid = _id
    return user
}

module.exports = model('User', UserSchema)
