const { Schema, model } = require('mongoose')

const BusinessSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
  },
  total_stars: {
    type: Number,
    default: 0,
  },
  total_users_feedback: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  employees: {
    type: Number,
    required: [true, 'El número de empleados es obligatorio.'],
  },
  latitude: {
    type: Number,
    required: [true, 'La latitud es obligatoria.'],
  },
  longitude: {
    type: Number,
    required: [true, 'La longitud es obligatoria.'],
  },
  image: {
    type: String,
    default: true,
  },
  service_types: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Service-Type',
      default: [],
      unique: true,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
})

// Modify the model we get when we query any user to abstract some useless data for frontend
BusinessSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject()
  type.uid = _id
  return type
}

module.exports = model('Business', BusinessSchema)
