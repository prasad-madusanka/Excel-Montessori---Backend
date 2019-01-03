const env = require('../../configuration/environment.config')
const userCollection = require('../../models/admin/user.model')

module.exports = {

    validateUserInsert: (req, res, next) => {

        var reqBody = req.body

        if (reqBody.name == undefined || reqBody.username == undefined || reqBody.password == undefined || reqBody.role == undefined) {

            return env.requestBodyFormatInvalid(res)

        } else if (!req.body.name || !req.body.username || !req.body.password || !req.body.role) {

            return env.requestFormatInvalid(res)

        } else {

            userCollection.findOne(
                { username: reqBody.username }
            )
                .then((data) => {

                    if (data) {
                        return env.sendResponse(res, env.OK, { message: env.TAG_USER_EXIST })
                    }

                    next()

                })

        }

    },

    validatePasswordReset: (req, res, next) => {

        var reqBody = req.body

        if (reqBody.uid == undefined || reqBody.password == undefined) {

            return env.requestBodyFormatInvalid(res)

        } else if (!reqBody.uid || !reqBody.password) {

            return env.requestFormatInvalid(res)

        } else {

            userCollection.findById(req.body.uid)
                .then((data) => {

                    if (!data) {
                        return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_USER_NOT_FOUND, uid: req.body.uid })

                    } else {
                        next()
                    }


                })
                .catch(err => {

                    if (err.kind === 'ObjectID') {
                        return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, uid: req.body.uid })

                    }

                    return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

                })

        }

    }


}
