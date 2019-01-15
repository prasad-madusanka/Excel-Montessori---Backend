const mongoose = require('mongoose')

const illnessSchema = mongoose.Schema({
    Seizures: Boolean,
    Allergies: Boolean,
    Respiratory_Illness: Boolean,
    Drug_Reactions: Boolean,
    ADHD: Boolean,
    Speech_Difficulty: Boolean,
}, {
        timestapms: true
    })

module.exports = mongoose.model('Illnesses', illnessSchema)