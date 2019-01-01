const entriesController = require('../../controllers/system-entries/entries.controller')
const entriesMiddleware = require('../../middlewares/system-entries/entries.middleware')

module.exports = (app) => {

    app.post('/excel/entries/non-payment', entriesMiddleware.validateNonPaymentEntries, entriesController.addNonPaymentEntries)
        .get('/excel/entries/non-payment', entriesController.getNonPaymentEntries)
        .put('/excel/entries/non-payment', entriesController.updateNonPaymentEntries)
        .delete('/excel/entries/non-payment/:eid', entriesController.deleteNonPaymentEntries)
        .post('/excel/entries/payment', entriesMiddleware.validatePaymentEntries, entriesController.addPaymentEntries)
        .get('/excel/entries/payment', entriesController.getPaymentEntries)
        .put('/excel/entries/payment', entriesController.updatePaymentEntries)
        .delete('/excel/entries/payment/:eid', entriesController.deletePaymentEntries)

}