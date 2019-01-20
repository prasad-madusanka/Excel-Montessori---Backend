const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({

    stName: String,
    stPreferedName: String,
    stDOB: String,
    stGender: String,
    stReligion: String,
    stNationality: String,
    stLanguage1: String,
    stLanguage2: String,
    stHomeAddress: String,
    stHomeTelephone: Number,
    faName: String,
    faNIC: String,
    faOccupation: String,
    faOfficeAddress: String,
    faMobile: Number,
    faOffTelephone: Number,
    moName: String,
    moNIC: String,
    moOccupation: String,
    moOfficeAddress: String,
    moMobile: Number,
    moOffTelephone: Number,
    picUpName1: String,
    picUpNIC1: String,
    picUpName2: String,
    picUpNIC2: String,
    ecName: String,
    ecRelationship: String,
    ecAddress: String,
    ecTelephone: Number,
    stIllnessTypes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Illnesses'
    },
    ofFacilityType: String,
    stAdmittedMonth: String,
    stAdmittedYear: Number,
    stAdmittedClass: String,
    discontinue: Boolean,
    admissionPayment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admission'
    },
    monthlyFee:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'MonthlyFee'
    }],
    otherPayments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OtherPayments'
    }

}, {
        timestamps: true
    })

module.exports = mongoose.model('Students', studentSchema)