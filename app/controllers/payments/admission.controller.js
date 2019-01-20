const admissionCollection = require('../../models/payments/admission.model')
const env = require('../../configuration/environment.config')

module.exports = {

    makeAdmissionPayment: (req, res, next) => {

        var reqBody = req.body

        var dateObj = new Date()
        var curTime = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()
        var curDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDay()

        admissionCollection.findOneAndUpdate(
            {
                $or: [
                    { _id: reqBody._id },
                    { studentId: reqBody._id }
                ]
            },
            {
                $push: {
                    installments: {
                        "installmentDate": curDate,
                        "installmentTime": curTime,
                        "reciept": reqBody.installment.reciept,
                        "amount": reqBody.installment.amount

                    }
                }
            },
            { new: true, upsert: false }
        )
            .then((dataAdmissionPayments) => {

                if (!dataAdmissionPayments) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, dataAdmissionPayments)

            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, recordId: reqBody._id })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })

    },

    updateAdmissionPayment: (req, res, next) => {

        var reqBody = req.body

        admissionCollection.findOneAndUpdate(
            { _id: reqBody._id, 'installments.reciept': reqBody.reciept },
            {
                $set: {
                    'installments.$.reciept': reqBody.installment.reciept,
                    'installments.$.amount': reqBody.installment.amount
                }
            },
            { new: true, upsert: false }
        )
            .then((dataAdmissionPaymentModified) => {

                if (!dataAdmissionPaymentModified) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, dataAdmissionPaymentModified)
            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, recordId: reqBody._id })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    pullAdmissionPayment: (req, res, next) => {

        var reqBody = req.body

        admissionCollection.updateOne(
            { _id: reqBody._id },
            { $pull: { installments: { reciept: reqBody.reciept } } },
            { new: true, upsert: false }
        )
            .then((dataAdmissionPaymentDelete) => {

                if (!dataAdmissionPaymentDelete) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, dataAdmissionPaymentDelete)
            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, recordId: reqBody._id })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    getAdmissionPayments: (req, res, next) => {
        admissionCollection.find()
            .then((dataAdmissions) => {
                if (env.isEmpty(dataAdmissions)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, dataAdmissions)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    getAdmissionFullyPaid: (req, res, next) => {
        admissionsPayments(req, res, 2)
    },

    getAdmissionPartiallyPaid: (req, res, next) => {
        admissionsPayments(req, res, 1)
    },

    getAdmissionNotPaid: (req, res, next) => {
        admissionsPayments(req, res, 0)
    },

    // getAdmissionPaidStudent: (req, res, next) => {

    //     var reqParams = req.params

    //     admissionCollection.findOne(
    //         {
    //             $and: [
    //                 { studentId: reqParams.studentId },
    //                 {}
    //             ]
    //         }
    //     )
    // }

}

function admissionsPayments(req, res, length) {
    admissionCollection.find(
        { installments: { $size: length } })
        .populate('studentId')
        .then((dataGetAdmission) => {
            if (env.isEmpty(dataGetAdmission)) {
                return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
            }
            env.sendResponse(res, env.OK, dataGetAdmission)
        })
        .catch(err => {
            return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
        })
}