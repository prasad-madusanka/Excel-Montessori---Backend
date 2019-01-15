const studentsCollection = require('../../models/student/student.model')
const illnessesCollection = require('../../models/illnesses/illness.model')
const admissionCollection = require('../../models/payments/admission.model')

const env = require('../../configuration/environment.config')

module.exports = {

    addStudent: (req, res, next) => {

        var reqBody = req.body

        new admissionCollection({
            totalFee: reqBody.admissionFee
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
                            admissionPayment: dataAdmission._id
                        })
                            .save()
                            .then((dataStudent) => {


                                admissionCollection.findOneAndUpdate(
                                    { _id: dataAdmission._id },
                                    { studentId: dataStudent._id },
                                    { new: true, upsert: false }
                                )
                                    .then((dataAdmissionUpdated) => {

                                        env.sendResponse(res, env.OK, { student: dataStudent, admissionModified: dataAdmissionUpdated })

                                    })
                                    .catch(err => {
                                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                                    })

                            })
                            .catch(err => {
                                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
                            })

                    })
                    .catch(err => {
                        env.sendResponse(res, env.INTERNAL_SERVER_ERROR, err.toString())
                    })

            })
            .catch(err => {
                env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    getStudents: (req, res, next) => {

        studentsCollection.find()
            .populate('stIllnessTypes admissionPayment')
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

        studentsCollection.findOne({ _id: studentId })
            .populate('stIllnessTypes admissionPayment')
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

    },

    deleteStudent: (req, res, next) => {

        var studentId = req.params.studentId

        studentsCollection.deleteOne(
            { _id: studentId }
        )
            .then((dataStudent) => {

                if (!dataStudent) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, { message: dataStudent })
            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, uid: req.params.uid })
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
                        stAdmittedClass: reqBody.stAdmittedClass
                    })
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