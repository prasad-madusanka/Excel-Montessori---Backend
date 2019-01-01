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
    stIllnessTypes: [{
        type: String
    }],
    ofFacilityType: Boolean,
    stAdmittedMonth: String,
    stAdmittedYear: Number,
    stAdmittedClass: String,
    payments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payments'
    }


}, {
        timestamps: true
    })

module.exports = mongoose.model('Students', studentSchema)