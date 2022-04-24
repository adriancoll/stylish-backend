const { Schema, model } = require("mongoose");

/**
 * @todo añadir tiempos de servicio
 */
const ServiceTypeSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio."],
  },
  // Duration in minutes
  duration: {
    type: Number,
    required: [true, "La duración del servicio es obligatorio."]
  },  
  status: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Modify the model we get when we query any user to abstract some useless data for frontend
ServiceTypeSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject();
  type.uid = _id;
  return type
};

module.exports = model("Service-Type", ServiceTypeSchema);
