const env = require('../../configuration/environment.config')

module.exports = {
    validateLogin: (req, res, next) => {

        var reqBody = req.body

        if (reqBody.username == undefined || reqBody.password == undefined) {

            return env.requestBodyFormatInvalid(res)

        } else if (!reqBody.username || !reqBody.password) {

            return env.requestFormatInvalid(res)

        } else {

            next()

        }

    }
}