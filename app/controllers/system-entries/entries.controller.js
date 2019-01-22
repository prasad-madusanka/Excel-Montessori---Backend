const npEntriesCollection = require('../../models/system-entries/non-payment-entries.model')
const pEntriesCollection = require('../../models/system-entries/payment-entries.model')
const env = require('../../configuration/environment.config')

module.exports = {

    addNonPaymentEntries: (req, res, next) => {

        var reqBody = req.body

        new npEntriesCollection({
            entryName: reqBody.entryName,
            entryYear: reqBody.entryYear
        })
            .save()
            .then((data) => {
                env.sendResponse(res, env.OK, data)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })

    },

    getNonPaymentEntries: (req, res, next) => {

        npEntriesCollection.find()
            .then((data) => {

                if (env.isEmpty(data)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, data)

            })
            .catch(err => {

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_NO_RECORDS_FOUND, error: err.toString() })

            })

    },

    updateNonPaymentEntries: (req, res, next) => {

        var reqBody = req.body

        npEntriesCollection.findOneAndUpdate(
            { _id: reqBody.eid },
            {
                entryName: reqBody.entryName,
                entryYear: reqBody.entryYear
            },
            { new: true, upsert: false })
            .then((data) => {
                env.sendResponse(res, env.OK, data)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    deleteNonPaymentEntries: (req, res, next) => {

        npEntriesCollection.deleteOne(
            { _id: req.params.eid })
            .then((data) => {

                if (env.isValidObject(data, 'n', 0)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, { message: data })

            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, uid: req.params.uid })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

            })
    },

    addPaymentEntries: (req, res, next) => {

        var reqBody = req.body

        new pEntriesCollection({
            entryName: reqBody.entryName,
            entryAmount: reqBody.entryAmount,
            entryClass: reqBody.entryClass,
            isSchool: reqBody.isSchool
        })
            .save()
            .then((data) => {
                env.sendResponse(res, env.OK, data)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    getPaymentEntries: (req, res, next) => {

        pEntriesCollection.find()
            .then((data) => {

                if (env.isEmpty(data)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, data)

            })
            .catch(err => {

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_NO_RECORDS_FOUND, error: err.toString() })

            })

    },

    getPaymentEntriesByClass: (req, res, next) => {

        var reqBody = req.body

        pEntriesCollection.find(
            {
                $and: [
                    { entryClass: reqBody.class },
                    { isSchool: reqBody.isSchool }
                ]
            }
        )
            .then((dataPEntries) => {

                if (env.isEmpty(dataPEntries)) {
                    return env.sendResponse(res, env.NOT_FOUND, env.TAG_NO_RECORDS_FOUND)
                }

                env.sendResponse(res, env.OK, dataPEntries)

            })
            .catch(err=>{
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
            })


    },

    updatePaymentEntries: (req, res, next) => {

        var reqBody = req.body

        pEntriesCollection.findByIdAndUpdate(
            { _id: reqBody.eid },
            {
                entryName: reqBody.entryName,
                entryAmount: reqBody.entryAmount,
                entryClass: reqBody.entryClass
            },
            { new: true, upsert: false })
            .then((data) => {
                env.sendResponse(res, env.OK, data)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })

    },

    deletePaymentEntries: (req, res, next) => {

        pEntriesCollection.deleteOne(
            { _id: req.params.eid })
            .then((data) => {

                if (env.isValidObject(data, 'n', 0)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, { message: data })

            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, uid: req.params.uid })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

            })
    }


}