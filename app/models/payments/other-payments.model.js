const mongoose = require('mongoose')

const otherPaymentsSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    },
    payments: [{
        paidFor: String,
        date: Date,
        reciept: String,
        amount: Number
    }]
}, {
        timestamps: true
    })

module.exports = mongoose.model('OtherPayments', otherPaymentsSchema)