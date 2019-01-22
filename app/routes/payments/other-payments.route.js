const otherPaymentsController = require('../../controllers/payments/other-payments.controller')

module.exports = (app) => {

    app.post('/excel/payments/other', otherPaymentsController.makeOtherPayment)
    app.put('/excel/payments/other', otherPaymentsController.updateOtherPayment)
    app.put('/excel/payments/other/remove', otherPaymentsController.pullOtherPayment)
    app.get('/excel/payments/other', otherPaymentsController.getOtherPayments)

}