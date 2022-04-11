const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosRoutePath = '/api/user';

        //Middlewares
        this.middlewares();

        this.routes();
    }

    middlewares() {
        // Política de CORS
        this.app.use(cors());

        // Lectura y parseo del body a JSON
        this.app.use( express.json() );

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.usuariosRoutePath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en puerto ${this.port}`)
        });
    }
}

module.exports = Server;