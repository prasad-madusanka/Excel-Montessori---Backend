const userController = require('../../controllers/admin/user.controller')
const userMiddleware = require('../../middlewares/admin/users.middleware')

module.exports = (app) => {
    app.post('/excel/users/add', userMiddleware.validateUserInsert, userController.addUser)
        .put('/excel/users/reset', userMiddleware.validatePasswordReset, userController.resetPassword)
        .get('/excel/users/:uid', userController.getUser)
        .get('/excel/users', userController.getUsers)
        .delete('/excel/users/:uid', userController.deleteUser)
}