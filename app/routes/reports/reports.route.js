const reportController = require('../../controllers/reports/reports.controller')

module.exports = (app) => {

    app.get('/excel/reports/admission/:status', reportController.getAdmissionPaymentsByStatus)
    app.post('/excel/reports/monthly-payments', reportController.getStudentsNotDiscontinue)

}