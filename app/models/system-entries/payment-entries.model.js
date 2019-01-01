const mongoose = require('mongoose')

const paymentEntriesSchema = mongoose.Schema({
    entryName: String,
    entryAmount: Number,
    entryYear: Number
}, {
        timestamps: true
    })
module.exports = mongoose.model('pEntries', paymentEntriesSchema)