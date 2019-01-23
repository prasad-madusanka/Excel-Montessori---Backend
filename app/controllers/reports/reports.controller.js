const admissionCollection = require('../../models/payments/admission.model')
const env = require('../../configuration/environment.config')

module.exports = {

    getAdmissionPaymentsByStatus: (req, res, next) => {

        var vStatus = req.params.status.toUpperCase()

        admissionCollection.find({ status: vStatus })
            .populate('studentId')
            .then((dataAdmissionPaymentStatus) => {

                if (env.isEmpty(dataAdmissionPaymentStatus)) {

                    var obj = { message: env.TAG_NO_RECORDS_FOUND, status: vStatus }

                    if (env.REPORT_STATUS_ADMISSION.indexOf(vStatus) == -1) {
                        obj = { message: env.TAG_NO_RECORDS_FOUND, status: vStatus, error: 'Invalid Keyword' }
                    }

                    return env.sendResponse(res, env.NOT_FOUND, obj)
                }

                env.sendResponse(res, env.OK, dataAdmissionPaymentStatus)

            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
            })

    }

}