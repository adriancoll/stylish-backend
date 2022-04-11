const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CNN);

    console.log("BASE DE DATOS ONLINE!");
  } catch (error) {
    console.log(error);
    throw new Error("Error al inicializar la base de datos en mongodb.");
  }
};

module.exports = {
  dbConnection,
};
