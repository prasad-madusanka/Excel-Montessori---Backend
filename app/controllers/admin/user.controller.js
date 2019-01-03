const userCollection = require('../../models/admin/user.model')
const env = require('../../configuration/environment.config')

module.exports = {

    addUser: (req, res, next) => {

        var reqBody = req.body

        new userCollection({
            name: reqBody.name,
            username: reqBody.username,
            password: reqBody.password,
            role: reqBody.role,
            isLoggedIn: false
        })
            .save()
            .then((data) => {
                env.sendResponse(res, env.OK, data)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    resetPassword: (req, res, next) => {

        var reqBody = req.body

        userCollection.updateOne(
            { _id: reqBody.uid },
            { password: reqBody.password },
            { upsert: false })

            .then((data) => {
                env.sendResponse(res, env.OK, data)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })
            })
    },

    getUser: (req, res, next) => {

        userCollection.findOne(
            { _id: req.params.uid }
        )
            .then((data) => {

                if (!data) {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, data)

            })
            .catch(err => {

                if (err.kind === 'ObjectId') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, uid: req.params.uid })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_RECORD_NOT_FOUND, error: err.toString() })

            })

    },

    getUsers: (req, res, next) => {

        userCollection.find()
            .then((data) => {

                if (env.isEmpty(data)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_NO_RECORDS_FOUND })
                }

                env.sendResponse(res, env.OK, data)
            })
            .catch(err => {
                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR,
                    { message: env.TAG_NO_RECORDS_FOUND, error: err.toString() })
            })

    },

    deleteUser: (req, res, next) => {

        userCollection.deleteOne(
            { _id: req.params.uid }
        )
            .then((data) => {

                if (env.isValidObject(data, 'n', 0)) {
                    return env.sendResponse(res, env.NOT_FOUND, { message: env.TAG_RECORD_NOT_FOUND })
                }

                env.sendResponse(res, env.OK, { message: data })




            })
            .catch(err => {

                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return env.sendResponse(res, env.NOT_FOUND, { error: env.TAG_SEARCH_DATA_INVALID, uid: req.params.uid })
                }

                return env.sendResponse(res, env.INTERNAL_SERVER_ERROR, { message: env.TAG_ACTION_FAILED, error: err.toString() })

            })

    }
}