const mongoose = require('mongoose')

const monthlyFeeSchema = mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    },
    month:String,
    amount: Number,
    totalAmount: Number,
    date: String,
    time: String,
    reciept: String,
    status: String
}, {
        timestamps: true
    })

module.exports = mongoose.model('MonthlyFee', monthlyFeeSchema)