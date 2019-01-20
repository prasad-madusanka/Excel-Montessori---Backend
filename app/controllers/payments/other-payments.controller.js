const otherPaymentsCollection = require('../../models/payments/other-payments.model')
const env = require('../../configuration/environment.config')

module.exports = {

    makeOtherPayment: (req, res, next) => {

        var reqBody = req.body

        // var dateObj = new Date()
        // var curTime = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()
        // var curDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDay()

        otherPaymentsCollection.findOneAndUpdate(
            { $or: [{ _id: reqBody._id }, { studentId: reqBody._id }] },
            {
                $push: {
                    payments: {
                        paidFor: reqBody.payment.paidFor,
                        date: new Date(),
                        reciept: reqBody.payment.reciept,
                        amount: reqBody.payment.amount
                    }
                }
            },
            { new: true, upsert: false }
        )
            .then((dataOtherPayments) => {

                if (!dataOtherPayments) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, dataOtherPayments)

            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, recordId: reqBody._id })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })

    },

    updateOtherPayment: (req, res, next) => {

        var reqBody = req.body
        otherPaymentsCollection.findOneAndUpdate(
            {
                $and: [
                    { 'payments.reciept': reqBody.reciept },
                    { $or: [{ _id: reqBody._id }, { studentId: reqBody._id }] }
                ]
            },
            {
                $set: {
                    'payments.$.paidFor': reqBody.payment.paidFor,
                    'payments.$.reciept': reqBody.payment.reciept,
                    'payments.$.amount': reqBody.payment.amount
                }
            },
            { new: true, upsert: false }
        )
            .then((dataOtherPaymentsModified) => {

                if (!dataOtherPaymentsModified) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, dataOtherPaymentsModified)
            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, recordId: reqBody._id })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    pullOtherPayment: (req, res, next) => {

        var reqBody = req.body

        otherPaymentsCollection.updateOne(
            {
                $or: [
                    { _id: reqBody._id },
                    { studentId: reqBody._id }
                ]
            },
            { $pull: { payments: { reciept: reqBody.reciept } } },
            { new: true, upsert: false }
        )
            .then((dataOtherPaymentDelete) => {

                if (!dataOtherPaymentDelete) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, dataOtherPaymentDelete)
            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, recordId: reqBody._id })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    getOtherPayments: (req, res, next) => {
        otherPaymentsCollection.find()
            .then((dataOtherPayments) => {
                if (env.isEmpty(dataOtherPayments)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, dataOtherPayments)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    }

}