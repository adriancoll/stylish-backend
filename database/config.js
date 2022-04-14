const mongoose = require("mongoose");
const debug = require('../utils/debug')

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);

    debug("Conexión de base de datos establecida", "success");
  } catch (error) {
    debug(error, "error");
    throw new Error("Error al inicializar la base de datos en mongodb.");
  }
};

module.exports = {
  dbConnection,
};
