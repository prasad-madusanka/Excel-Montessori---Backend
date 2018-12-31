const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: String,
        username: String,
        password: String,
        role: String,
        isLoggedIn: Boolean
    }, {
        timestamps: true
    })

module.exports = mongoose.model('Users', userSchema)

