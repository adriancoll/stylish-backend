const { Schema, model } = require("mongoose");

const BusinessSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio."],
  },
  employees: {
    type: Number,
    required: [true, "El número de empleados es obligatorio."]
  },
  image: {
    type: String,
    default: true,
  },
  service_types: [{
      type:Schema.Types.ObjectId,
      ref: 'Service-Type',
      default: [],
      unique: true
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    unique: true  ,
    required: true
  }
});

// Modify the model we get when we query any user to abstract some useless data for frontend
BusinessSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject();
  type.uid = _id;
  return type
};

module.exports = model("Business", BusinessSchema);
