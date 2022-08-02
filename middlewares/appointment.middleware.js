const moment = require('moment')
moment.locale('es')
const { response, request, NextFunction } = require('express')

const { Appointment, Service_type } = require('../models')
const { error } = require('../helpers')

const checkAppointmentConflicts = async (
    req = request,
    res = response,
    next = NextFunction
) => {
    const { user, business, service_type, date } = req.body

    /** @var {Number} duration duration of the service */
    const { duration } = await Service_type.findById(service_type)

    /** @var {Date} startDateMargin get the date time substracting service duration */
    //   const startDateMargin = momewe3ent(date).substract(duration, 'm')
    const startDateMargin = moment(date).substract(duration, 'm')

    /** @var {Date} startDateMargin get the date time adding service duration */
    const endDateMargin = moment(date).add(duration, 'm')

    // Find if there's any appointment on user or business to validate
    const [userHasAppointment, businessHasAppointment] = await Promise.all([
        Appointment.find({
            user,
            date: {
                $gte: startDateMargin.toDate(),
                $lte: endDateMargin.toDate(),
            },
        }),
        Appointment.find({
            business,
            date: {
                $gte: startDateMargin.toDate(),
                $lte: endDateMargin.toDate(),
            },
        }),
    ])

    if (userHasAppointment || businessHasAppointment) {
        let cause = userHasAppointment ? 'usuario' : 'negocio'
        return res
            .status(400)
            .json(
                error(
                    `Parece que el ${cause} ya tiene una reserva asignada entre las fechas ${startDateMargin.format(
                        'DD MM YYYY hh:mm:ss '
                    )} - ${endDateMargin.format('DD MM YYYY hh:mm:ss ')}`,
                    res.statusCode
                )
            )
    }

    next()
}

module.exports = {
    checkAppointmentConflicts,
}
