const parseMyAppointments = (appointments) => ({
  PENDING_CONFIRM: appointments.filter(
    (appointment) => appointment.status === 'PENDING_CONFIRM'
  ),
  CONFIRMED: appointments.filter(
    (appointment) => appointment.status === 'CONFIRMED'
  ),
  COMPLETED: appointments.filter(
    (appointment) => appointment.status === 'COMPLETED'
  ),
  CANCELED: appointments.filter(
    (appointment) => appointment.status === 'CANCELED'
  ),
  TIMEOUT: appointments.filter(
    (appointment) => appointment.status === 'TIMEOUT'
  ),
})

module.exports = {
  parseMyAppointments,
}
