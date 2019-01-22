const studentsCollection = require('../../models/student/student.model')
const illnessesCollection = require('../../models/illnesses/illness.model')
const admissionCollection = require('../../models/payments/admission.model')
const monthFeeCollection = require('../../models/payments/monthly-fee.model')
const otherPaymentsCollection = require('../../models/payments/other-payments.model')
const paymentEntriesCollection = require('../../models/system-entries/payment-entries.model')

const env = require('../../configuration/environment.config')

var school_only = 'School only'

module.exports = {

    addStudent: (req, res, next) => {

        var reqBody = req.body

        new admissionCollection({
            totalFee: reqBody.admissionFee,
            facilityType: reqBody.ofFacilityType
        })
            .save()
            .then((dataAdmission) => {

                new illnessesCollection({
                    Seizures: reqBody.illSeizures,
                    Allergies: reqBody.illAllergies,
                    Respiratory_Illness: reqBody.illRespiratory_Illness,
                    Drug_Reactions: reqBody.illDrug_Reactions,
                    ADHD: reqBody.illADHD,
                    Speech_Difficulty: reqBody.illSpeech_Difficulty,
                })
                    .save()
                    .then((dataIllnessTypes) => {
                        paymentEntriesCollection.findOne(
                            {
                                $and: [
                                    { entryClass: reqBody.stAdmittedClass },
                                    { entryName: school_only }
                                ]
                            }

                        )
                            .then((dataPaymentEntries) => {

                                if (!dataPaymentEntries) {
                                    return env.sendResponse(res, env.BAD_REQUEST, { message: 'Payment entry not available' })
                                }

                                new studentsCollection({
                                    stName: reqBody.stName,
                                    stPreferedName: reqBody.stPreferedName,
                                    stDOB: reqBody.stDOB,
                                    stGender: reqBody.stGender,
                                    stReligion: reqBody.stReligion,
                                    stNationality: reqBody.stNationality,
                                    stLanguage1: reqBody.stLanguage1,
                                    stLanguage2: reqBody.stLanguage2,
                                    stHomeAddress: reqBody.stHomeAddress,
                                    stHomeTelephone: reqBody.stHomeTelephone,
                                    faName: reqBody.faName,
                                    faNIC: reqBody.faNIC,
                                    faOccupation: reqBody.faOccupation,
                                    faOfficeAddress: reqBody.faOfficeAddress,
                                    faMobile: reqBody.faMobile,
                                    faOffTelephone: reqBody.faOffTelephone,
                                    moName: reqBody.moName,
                                    moNIC: reqBody.moNIC,
                                    moOccupation: reqBody.moOccupation,
                                    moOfficeAddress: reqBody.moOfficeAddress,
                                    moMobile: reqBody.moMobile,
                                    moOffTelephone: reqBody.moOffTelephone,
                                    picUpName1: reqBody.picUpName1,
                                    picUpNIC1: reqBody.picUpNIC1,
                                    picUpName2: reqBody.picUpName2,
                                    picUpNIC2: reqBody.picUpNIC2,
                                    ecName: reqBody.ecName,
                                    ecRelationship: reqBody.ecRelationship,
                                    ecAddress: reqBody.ecAddress,
                                    ecTelephone: reqBody.ecTelephone,
                                    stIllnessTypes: dataIllnessTypes._id,
                                    ofFacilityType: reqBody.ofFacilityType,
                                    stAdmittedMonth: reqBody.stAdmittedMonth,
                                    stAdmittedYear: reqBody.stAdmittedYear,
                                    stAdmittedClass: reqBody.stAdmittedClass,
                                    discontinue: false,
                                    admissionPayment: dataAdmission._id,
                                    monthlyFeeClass: dataPaymentEntries._id
                                })
                                    .save()
                                    .then((dataStudent) => {

                                        new otherPaymentsCollection({
                                            studentId: dataStudent._id
                                        })
                                            .save()
                                            .then((dataExtraPayments) => {

                                                studentsCollection.updateOne(
                                                    { _id: dataStudent._id },
                                                    { otherPayments: dataExtraPayments._id },
                                                    { new: true, upsert: false }
                                                )
                                                    .then((dataUpdatedStudent) => {
                                                        admissionCollection.findOneAndUpdate(
                                                            { _id: dataAdmission._id },
                                                            { studentId: dataStudent._id },
                                                            { new: true, upsert: false }
                                                        )
                                                            .then((dataAdmissionUpdated) => {

                                                                env.sendResponse(res, env.OK, { student: dataStudent, studentModified: dataUpdatedStudent, admissionModified: dataAdmissionUpdated })

                                                            })
                                                            .catch(err => {
                                                                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                                                            })
                                                    })
                                                    .catch(err => {
                                                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                                                    })

                                            })
                                            .catch(err => {
                                                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                                            })


                                    })
                                    .catch(err => {
                                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                                    })



                            })
                            .catch(err => {
                                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                            })


                    })
                    .catch(err => {
                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                    })

            })
            .catch(err => {
                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    getStudents: (req, res, next) => {

        studentsCollection.find()
            .populate('stIllnessTypes admissionPayment monthlyFee otherPayments monthlyFeeClass')
            .then((dataStudents) => {

                if (env.isEmpty(dataStudents)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, dataStudents)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_NO_RECORDS_FOUND, error: err.toString() })
            })

    },

    getStudent: (req, res, next) => {

        var studentId = req.params.studentId
        getStudentById(res, studentId)


    },

    getStudentByClass: (req, res, next) => {

        studentsCollection.find({ stAdmittedClass: req.params.className })
            .populate('stIllnessTypes admissionPayment monthlyFee otherPayments monthlyFeeClass')
            .then((dataStudents) => {
                if (env.isEmpty(dataStudents)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, dataStudents)

            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
            })

    },

    deleteStudent: (req, res, next) => {

        var studentId = req.params.studentId

        studentsCollection.deleteOne
            ({ _id: studentId })
            .then((dataStudent) => {

                if (!dataStudent) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                admissionCollection.deleteOne
                    ({ 'studentId': studentId })
                    .then((dataAdmission) => {

                        if (!dataAdmission) {
                            return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                        }

                        monthFeeCollection.deleteMany
                            ({ 'studentId': studentId })
                            .then((dataMonthlyFee) => {

                                if (!dataMonthlyFee) {
                                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                                }

                                otherPaymentsCollection.deleteOne
                                    ({ 'studentId': studentId })
                                    .then((dataOtherPayments) => {

                                        if (!dataOtherPayments) {
                                            return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                                        }

                                        env.sendResponse(res, env.OK,
                                            {
                                                'student': dataStudent,
                                                'admission': dataAdmission,
                                                'monthleFee': dataMonthlyFee,
                                                'otherPayments': dataOtherPayments
                                            })

                                    })
                                    .catch(err => {

                                        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                            return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'studentId': studentId })
                                        }

                                        return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

                                    })

                            })
                            .catch(err => {

                                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'studentId': studentId })
                                }

                                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

                            })

                    })
                    .catch(err => {

                        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                            return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'studentId': studentId })
                        }

                        return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

                    })


            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'studentId': studentId })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

            })

    },

    updateStudent: (req, res, next) => {

        var reqBody = req.body
        var studentId = reqBody.studentId
        var illnessTypeId = reqBody.illnessTypeId

        illnessesCollection.updateOne(
            { _id: illnessTypeId },
            {
                Seizures: reqBody.illSeizures,
                Allergies: reqBody.illAllergies,
                Respiratory_Illness: reqBody.illRespiratory_Illness,
                Drug_Reactions: reqBody.illDrug_Reactions,
                ADHD: reqBody.illADHD,
                Speech_Difficulty: reqBody.illSpeech_Difficulty,
            },
            { new: true, upsert: false })
            .then((dataIllnessTypes) => {

                if (!dataIllnessTypes) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                paymentEntriesCollection.findOne(
                    {
                        $and: [
                            { entryClass: reqBody.stAdmittedClass },
                            { entryName: school_only }
                        ]
                    }

                )
                    .then((dataPaymentEntries) => {

                        if (!dataPaymentEntries) {
                            return env.sendResponse(res, env.BAD_REQUEST, { message: 'Payment entry not available' })
                        }

                        studentsCollection.updateOne(
                            { _id: studentId },
                            {
                                stName: reqBody.stName,
                                stPreferedName: reqBody.stPreferedName,
                                stDOB: reqBody.stDOB,
                                stGender: reqBody.stGender,
                                stReligion: reqBody.stReligion,
                                stNationality: reqBody.stNationality,
                                stLanguage1: reqBody.stLanguage1,
                                stLanguage2: reqBody.stLanguage2,
                                stHomeAddress: reqBody.stHomeAddress,
                                stHomeTelephone: reqBody.stHomeTelephone,
                                faName: reqBody.faName,
                                faNIC: reqBody.faNIC,
                                faOccupation: reqBody.faOccupation,
                                faOfficeAddress: reqBody.faOfficeAddress,
                                faMobile: reqBody.faMobile,
                                faOffTelephone: reqBody.faOffTelephone,
                                moName: reqBody.moName,
                                moNIC: reqBody.moNIC,
                                moOccupation: reqBody.moOccupation,
                                moOfficeAddress: reqBody.moOfficeAddress,
                                moMobile: reqBody.moMobile,
                                moOffTelephone: reqBody.moOffTelephone,
                                picUpName1: reqBody.picUpName1,
                                picUpNIC1: reqBody.picUpNIC1,
                                picUpName2: reqBody.picUpName2,
                                picUpNIC2: reqBody.picUpNIC2,
                                ecName: reqBody.ecName,
                                ecRelationship: reqBody.ecRelationship,
                                ecAddress: reqBody.ecAddress,
                                ecTelephone: reqBody.ecTelephone,
                                ofFacilityType: reqBody.ofFacilityType,
                                stAdmittedMonth: reqBody.stAdmittedMonth,
                                stAdmittedYear: reqBody.stAdmittedYear,
                                stAdmittedClass: reqBody.stAdmittedClass,
                                monthlyFeeClass: dataPaymentEntries._id
                            })
                            .then((dataStudent) => {

                                if (!dataStudent) {
                                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                                }

                                admissionCollection.updateOne
                                    (
                                        { 'studentId': studentId },
                                        {
                                            facilityType: reqBody.ofFacilityType,
                                            totalFee: reqBody.admissionFee
                                        },
                                        { new: true, upsert: false })
                                    .then((dataAdmissionUpdated) => {

                                        if (!dataAdmissionUpdated) {
                                            return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                                        }

                                        getStudentById(res, studentId)

                                    })


                                //dataIllnessTypes
                            })
                            .catch(err => {

                                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'studentId': studentId })
                                }

                                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
                            })

                    })
                    .catch(err => {
                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
                    })
            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'illnessId': illnessTypeId })
                }

                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
            })

    },

    discontinueStudent: (req, res, next) => {
        studentStudingStatus(req, res, true)
    },

    continueStudent: (req, res, next) => {
        studentStudingStatus(req, res, false)
    }

}

function studentStudingStatus(req, res, isDiscontinue) {

    studentsCollection.updateOne(
        { _id: req.params.studentId },
        { discontinue: isDiscontinue }
    )
        .then((dataStudent) => {
            if (!dataStudent) {
                return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
            }
            env.sendResponse(res, env.OK, dataStudent)
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'studentId': req.params.studentId })
            }

            return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_RECORD_NOT_FOUND, error: err.toString() })
        })

}

function getStudentById(res, studentId) {


    studentsCollection.findOne({ _id: studentId })
        .populate('stIllnessTypes admissionPayment monthlyFee otherPayments monthlyFeeClass')
        .then((dataStudent) => {

            if (!dataStudent) {
                return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
            }

            env.sendResponse(res, env.OK, dataStudent)

        })
        .catch(err => {

            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, 'studentId': studentId })
            }

            return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_RECORD_NOT_FOUND, error: err.toString() })
        })
}