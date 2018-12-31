const loginController = require('../../controllers/login/login.controller')
const loginMiddleware = require('../../middlewares/login/login.middleware')

module.exports = (app) => {
    app.post('/excel/login', loginMiddleware.validateLogin, loginController.signIn)
        .get('/excel/logout/:username', loginController.signOut)
}