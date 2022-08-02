const mongoose = require('mongoose')
const debug = require('../utils/debug')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        debug('Conexión de base de datos establecida', 'success')
    } catch (error) {
        debug(error.message, 'error')
        return
    }
}

module.exports = {
    dbConnection,
}
