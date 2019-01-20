const mongoose = require('mongoose')

const admissionSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    },
    installments: [{
        installmentDate: String,
        installmentTime: String,
        reciept: String,
        amount: Number
    }],
    totalFee: Number,
    facilityType: String
}, {
        timestamps: true
    })

module.exports = mongoose.model('Admission', admissionSchema)