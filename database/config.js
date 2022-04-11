const mongoose = require("mongoose");

const dbConnection = async () => {
  mongoose.connect(process.env.MONDOGDB_CNN);
};

module.exports = {
  dbConnection
};
