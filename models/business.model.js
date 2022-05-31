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
    default: 'https://uning.es/wp-content/uploads/2016/08/ef3-placeholder-image.jpg',
  },
  service_types: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Service-Type',
      default: [],
      unique: true,
      autopopulate: true,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
    autopopulate: true,
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria.'],
    maxlength: [255, 'La descripción no puede tener más de 255 caracteres.'],
  },
})

// Modify the model we get when we query any user to abstract some useless data for frontend
BusinessSchema.methods.toJSON = function () {
  const { __v, _id, service_types, ...type } = this.toObject()
  
  type.service_types = service_types.map((service_type) => {
    service_type.uid = service_type._id.toString()
    delete service_type._id
    return service_type
  })

  type.uid = _id
  return type
}

module.exports = model('Business', BusinessSchema)
