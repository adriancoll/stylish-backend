const { Schema, model } = require("mongoose");

const ServiceTypeSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio."],
  },
  duration: {
    type: Number,
    required: [true, "La duración del servicio es obligatorio."],
  },
  status: {
    type: Boolean,
    default: true,
  },
});

// Modify the model we get when we query any user to abstract some useless data for frontend
ServiceTypeSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject();
  type.uid = _id;
  return type;
};

module.exports = model("Service-Type", ServiceTypeSchema);
