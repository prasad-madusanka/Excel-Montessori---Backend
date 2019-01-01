const env = require('../../configuration/environment.config')

module.exports = {

    validateNonPaymentEntries: (req, res, next) => {

        var reqBody = req.body

        if (reqBody.entryName == undefined || reqBody.entryYear == undefined) {
            return env.requestBodyFormatInvalid(res)

        } else if (!reqBody.entryName || !reqBody.entryYear) {
            return env.requestFormatInvalid(res)

        } else {
            next()
        }

    },

    validatePaymentEntries: (req, res, next) => {

        var reqBody = req.body

        if (reqBody.entryName == undefined || reqBody.entryAmount == undefined || reqBody.entryYear == undefined) {
            return env.requestBodyFormatInvalid(res)

        } else if (!reqBody.entryName || !reqBody.entryAmount || !reqBody.entryYear) {
            return env.requestFormatInvalid(res)

        } else {
            next()
        }

    }

}