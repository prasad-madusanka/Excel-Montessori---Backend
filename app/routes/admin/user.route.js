const userController = require('../../controllers/admin/user.controller')
const userMiddleware = require('../../middlewares/admin/users.middleware')

module.exports = (app) => {
    app.post('/excel/users', userMiddleware.validateUserInsert, userController.addUser)
        .put('/excel/users', userMiddleware.validatePasswordReset, userController.resetPassword)
        .get('/excel/users/:uid', userController.getUser)
        .get('/excel/users', userController.getUsers)
        .delete('/excel/users/:uid', userController.deleteUser)
}