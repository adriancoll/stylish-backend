const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const { validateJWT } = require("../middlewares/jwt-validator");
const debug = require('../utils/debug')

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.authPath             = "/api/auth";
    this.usuariosRoutePath    = "/api/user";
    this.serviceTypeRoutePath = "/api/service/type";
    this.businessRoutePath    = "/api/business";
    this.appointmentRoutePath    = "/api/appointment";

    //conectar base de datos
    this.conectarDB();

    //Middlewares
    this.middlewares();

    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // Política de CORS
    this.app.use(cors());

    // Lectura y parseo del body a JSON
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth.routes"));
    this.app.use(this.usuariosRoutePath, validateJWT, require("../routes/user.routes"));
    this.app.use(this.serviceTypeRoutePath, require("../routes/service-type.routes"));
    this.app.use(this.businessRoutePath, require("../routes/business.routes"));
    this.app.use(this.appointmentRoutePath, require("../routes/appointment.routes"));
  }

  listen() {
    this.app.listen(this.port, () => {
      debug(`Servidor corriendo en puerto ${this.port}`, "rainbow");
    });
  }
}

module.exports = Server;
