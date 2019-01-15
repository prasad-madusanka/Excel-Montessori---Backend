const mongoose = require('mongoose')

const paymentEntriesSchema = mongoose.Schema({
    entryName: String,
    entryAmount: Number,
    entryClass: String,
    isSchool: Boolean
}, {
        timestamps: true
    })
module.exports = mongoose.model('pEntries', paymentEntriesSchema)