const monthFeeController = require('../../controllers/payments/monthly-fee.controller')

module.exports = (app) => {

    app.post('/excel/payments/monthly-fee', monthFeeController.makePayment)
    app.put('/excel/payments/monthly-fee', monthFeeController.updatePayment)
    app.put('/excel/payments/monthly-fee/remove', monthFeeController.pullPayment)
    app.get('/excel/payments/monthly-fee', monthFeeController.getPayments)
    app.get('/excel/payments/monthly-fee/:monthlyFeeId', monthFeeController.getPayment)
    app.get('/excel/payments/monthly-fee/student/:studentId', monthFeeController.getPaymentByStudent)

}