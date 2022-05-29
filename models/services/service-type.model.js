const { Schema, model } = require('mongoose')

const ServiceTypeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
  },
  duration: {
    type: Number,
    required: [true, 'La duración del servicio es obligatorio.'],
  },
  status: {
    type: Boolean,
    default: true,
    select: false,
  },
})

// Modify the model we get when we query any user to abstract some useless data for frontend
ServiceTypeSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject()
  type.uid = _id
  return type
}

ServiceTypeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.uid = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = model('Service-Type', ServiceTypeSchema)
