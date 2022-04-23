const { Schema, model } = require('mongoose')

const AppointmentSchema = new Schema({
    
    timestamp: true
})

// Modify the model we get when we query any user to abstract some useless data for frontend
AppointmentSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject()
  type.uid = _id
  return type
}

module.exports = model('Appointment', AppointmentSchema)
