const reportController = require('../../controllers/reports/reports.controller')

module.exports = (app) => {

    app.get('/excel/reports/admission/:status', reportController.getAdmissionPaymentsByStatus)

}