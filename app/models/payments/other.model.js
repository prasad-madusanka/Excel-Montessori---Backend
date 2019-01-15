const mongoose =  require('mongoose')

const paymentMonthSchema = mongoose.Schema({
    studentID: mongoose.Schema.Types.ObjectId,
    month
})