const { Schema, model } = require("mongoose");

const options = {
  timestamps: true,
};

const AppointmentSchema = new Schema(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },
    service_type: {
      type: Schema.Types.ObjectId,
      ref: "Service-Type",
      required: true,
    },
    observations: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "PENDING_CONFIRM",
      emun: ["PENDING_CONFIRM", "CONFIRMED", "COMPLETED", "CANCELLED"],
    },
  },
  options
);

// Modify the model we get when we query any user to abstract some useless data for frontend
AppointmentSchema.methods.toJSON = function () {
  const { __v, _id, ...type } = this.toObject();
  type.uid = _id;
  return type;
};

module.exports = model("Appointment", AppointmentSchema);