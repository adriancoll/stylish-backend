const { response } = require("express")
const { request } = require("express")

const storeAppointment = (req = request, res = response) => {
    res.json({a:1})
}

module.exports = {
    storeAppointment,
}