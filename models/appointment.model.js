const { Schema, model } = require('mongoose')
const mongoose = require('mongoose')
var deepPopulate = require('mongoose-deep-populate')(mongoose)

const options = {
  timestamps: true,
  selectPopulatedPaths: true,
}

const AppointmentSchema = new Schema(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      autopopulate: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true,
    },
    service_type: {
      type: Schema.Types.ObjectId,
      ref: 'Service-Type',
      required: true,
      autopopulate: true,
    },
    observations: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: 'PENDING_CONFIRM',
      emun: [
        'PENDING_CONFIRM',
        'CONFIRMED',
        'COMPLETED',
        'CANCELED',
        'TIMEOUT',
      ],
    },
  },
  options
)

AppointmentSchema.plugin(require('mongoose-autopopulate'))
AppointmentSchema.plugin(deepPopulate, {
  populate: {},
})

// Modify the model we get when we query any user to abstract some useless data for frontend
AppointmentSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject()

  type.uid = _id
  type.business.uid = type.business._id
  type.user.uid = type.user._id
  type.service_type.uid = type.service_type._id

  type.business.service_types = type.business.service_types.map(
    (service_type) => {
      service_type.uid = service_type._id.toString()
      delete service_type._id
      delete service_type.__v
      return service_type
    }
  )

  delete type._id
  delete type.__v
  
  delete type.business._id

  delete type.service_type._id
  delete type.service_type.__v

  delete type.user._id
  delete type.user.__v

  return type
}

module.exports = model('Appointment', AppointmentSchema)
