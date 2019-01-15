const admissionController = require('../../controllers/payments/admission.controller')

module.exports = (app) => {
    app.put('/excel/payments/admission/make-payment', admissionController.makeAdmissionPayment)
    app.put('/excel/payments/admission/modify-payment', admissionController.updateAdmissionPayment)
    app.delete('/excel/payments/admission', admissionController.pullAdmissionPayment)
    app.get('/excel/payments/admission', admissionController.getAdmissionPayments)
    app.get('/excel/payments/admission/fully-paid', admissionController.getAdmissionFullyPaid)
    app.get('/excel/payments/admission/partially-paid', admissionController.getAdmissionPartiallyPaid)
    app.get('/excel/payments/admission/not-paid', admissionController.getAdmissionNotPaid)
}