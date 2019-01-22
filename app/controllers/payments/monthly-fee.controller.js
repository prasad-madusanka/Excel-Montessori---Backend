const monthlyFeeCollection = require('../../models/payments/monthly-fee.model')
const studentCollection = require('../../models/student/student.model')
const env = require('../../configuration/environment.config')

module.exports = {

    makePayment: (req, res, next) => {

        var reqBody = req.body

        var dateObj = new Date()
        var curTime = dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds()
        var curDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDay()

        new monthlyFeeCollection({
            studentId: reqBody.studentId,
            month: reqBody.month,
            amount: reqBody.amount,
            totalAmount: reqBody.totalAmount,
            date: curDate,
            time: curTime,
            reciept: reqBody.reciept,
            status: reqBody.status
        })
            .save()
            .then((dataMonthlyFee) => {

                studentCollection.updateOne
                    (
                        { _id: reqBody.studentId },
                        {
                            $push:
                                { monthlyFee: dataMonthlyFee._id }
                        }
                    )
                    .then((dataStudent) => {

                        if (!dataStudent) {
                            return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                        }


                        monthlyFeeCollection.find({ studentId: reqBody.studentId })
                            .then((mMonthlyPaymentData) => {
                                if (env.isEmpty(mMonthlyPaymentData)) {
                                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                                }

                                env.sendResponse(res, env.OK, mMonthlyPaymentData)

                            })
                            .catch(err => {
                                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, studentId: reqBody.studentId })
                                }

                                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
                            })

                    })
                    .catch(err => {

                        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                            return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, studentId: reqBody.studentId })
                        }

                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())

                    })


            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })

    },

    updatePayment: (req, res, next) => {

        var reqBody = req.body

        monthlyFeeCollection.updateOne(
            { _id: reqBody._id },
            {
                month: reqBody.month,
                amount: reqBody.amount,
                totalAmount: reqBody.totalAmount,
                reciept: reqBody.reciept
            },
            { new: true, upsert: false }
        )
            .then((dataMonthlyFee) => {

                if (!dataMonthlyFee) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                monthlyFeeCollection.find({ studentId: reqBody.studentId })
                    .then((mSchoolPayments) => {

                        if (env.isEmpty(mSchoolPayments)) {
                            return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                        }

                        env.sendResponse(res, env.OK, mSchoolPayments)

                    })
                    .catch(err => {
                        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                            return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, studentId: reqBody.studentId })
                        }

                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
                    })



            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, monthlyFeeId: reqBody._id })
                }

                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())

            })

    },

    pullPayment: (req, res, next) => {

        var reqBody = req.body


        studentCollection.updateOne(
            { _id: reqBody.studentId },
            { $pull: { monthlyFee: reqBody.monthlyFeeId } },
            { new: true, upsert: false }
        )
            .then((dataStudent) => {

                if (!dataStudent) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                monthlyFeeCollection.deleteOne(
                    { _id: reqBody.monthlyFeeId })
                    .then((dataMonthlyFee) => {

                        if (!dataMonthlyFee || dataMonthlyFee.n == 0) {
                            return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                        }

                        monthlyFeeCollection.find({ studentId: reqBody.studentId })
                            .then((mSchoolPayments) => {

                                // if (env.isEmpty(mSchoolPayments)) {
                                //     return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                                // }

                                env.sendResponse(res, env.OK, mSchoolPayments)

                            })
                            .catch(err => {
                                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { error: env.TAG_SEARCH_DATA_INVALID, studentId: reqBody.studentId })
                                }

                                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
                            })

                    })
                    .catch(err => {

                        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                            return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { error: env.TAG_SEARCH_DATA_INVALID, monthlyFeeId: reqBody._id })
                        }

                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())

                    })

            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { error: env.TAG_SEARCH_DATA_INVALID, monthlyFeeId: reqBody._id })
                }

                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())

            })

    },

    getPayments: (req, res, next) => {
        monthlyFeeCollection.find()
            .then((dataMonthlyFee) => {
                if (env.isEmpty(dataMonthlyFee)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, dataMonthlyFee)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
            })
    },

    getPayment: (req, res, next) => {

        monthlyFeeCollection.findOne
            ({ _id: req.params.monthlyFeeId })
            .then((dataMonthlyFee) => {
                if (!dataMonthlyFee) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, dataMonthlyFee)
            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { error: env.TAG_SEARCH_DATA_INVALID, monthlyFeeId: req.params.monthlyFeeId })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
            })

    },

    getPaymentByStudent: (req, res, next) => {


        monthlyFeeCollection.find(
            { studentId: req.params.studentId }
        )
            .then((dataStudent) => {
                if (env.isEmpty(dataStudent)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, dataStudent)

            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { error: env.TAG_SEARCH_DATA_INVALID, studentId: req.params.studentId })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())

            })



    }
}