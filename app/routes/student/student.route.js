const studentController = require('../../controllers/student/student.controller')

module.exports = (app) => {

    app.post('/excel/student', studentController.addStudent)
        .get('/excel/student', studentController.getStudents)
        .get('/excel/student/:studentId', studentController.getStudent)
        .delete('/excel/student', studentController.deleteStudent)
        .put('/excel/student', studentController.updateStudent)
        .put('/excel/student/discontinue/:studentId', studentController.discontinueStudent)
        .put('/excel/student/continue/:studentId', studentController.continueStudent)

}