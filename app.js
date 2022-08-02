require('dotenv').config()
const Server = require('./models/server')

// Creamos la instancia de express y rutas...
const server = new Server()

// Server escuchando
server.listen()
