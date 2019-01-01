const mongoose = require('mongoose')

const nonPaymentEntriesSchema = mongoose.Schema({

    entryName: String,
    entryYear: Number

}, {
        timestamps: true
    })

module.exports = mongoose.model('npEntries', nonPaymentEntriesSchema)