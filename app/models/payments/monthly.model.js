const mongoose = require('mongoose')

const monthlyFeeSchema = mongoose.Schema({
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    },
    month:String,
    amount: Number,
    totalAmount: Number,
    date: Date,
    reciept: String,
    status: String
}, {
        timestamps: true
    })

module.exports = mongoose.model('Monthly_Fee', monthlyFeeSchema)