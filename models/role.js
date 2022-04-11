const { Schema, model } = require("mongoose");

const RoleSchema = new Schema({
  name: {
    type: String,
    required: [true, "El nombre del rol es obligatorio."],
  },
});

module.exports = model("Role", RoleSchema);
