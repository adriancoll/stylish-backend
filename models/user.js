const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre es obligatorio."],
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria."],
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: "USER_ROLE",
    emun: ["ADMIN_ROLE", "USER_ROLE", "BUSINESS_ROLE"],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function() {
  const { __v, password, ...user } = this.toObject();
  return user
}

module.exports = model("User", UserSchema);
