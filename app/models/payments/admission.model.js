const mongoose = require('mongoose')

const admissionSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    },
    installments: [{
        installmentDate: Date,
        reciept: String,
        amount: Number
    }],
    totalFee: Number
}, {
        timestamps: true
    })

module.exports = mongoose.model('Admission', admissionSchema)