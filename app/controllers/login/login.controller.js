const userCollection = require('../../models/admin/user.model')
const env = require('../../configuration/environment.config')

module.exports = {

    signIn: (req, res, next) => {

        var reqBody = req.body

        userCollection.findOne(
            {
                $and: [
                    { username: reqBody.username },
                    { password: reqBody.password }
                ]
            }
        )
            .select('role username name')
            .then((data) => {

                if (!data) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_USER_NOT_FOUND, status: true })
                }

                env.sendResponse(res, env.OK, data)

                // userCollection.updateOne(
                //     { username: reqBody.username },
                //     { isLoggedIn: true },
                //     { upsert: true }
                // )
                //     .then((dta) => {
                //         env.sendResponse(res, env.OK, data)
                //     })
                //     .catch(err => {
                //         return env.sendResponse(res, env.UNAUTHORIZE, { message: env.TAG_ACTION_FAILED, error: err.toString() })
                //     })



            })
            .catch(err => {

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_RECORD_NOT_FOUND, error: err.toString() })

            })
    },

    signOut: (req, res, next) => {

        userCollection.update(
            { username: req.params.username },
            { isLoggedIn: false },
            { upsert: true }
        )
            .then((data) => {

                if (!data) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                return env.sendResponse(res, env.OK, { message: env.TAG_SUCCESS })
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })

    }
}