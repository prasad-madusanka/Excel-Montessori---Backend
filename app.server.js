const env = require('./app/configuration/environment.config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')


const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var originsWhitelist = ['http://localhost:4200']

var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: false
}

app.use(cors(corsOptions));

mongoose.Promise = global.Promise

mongoose.connect(env.DB_URL, { useNewUrlParser: true })
    .then(() => {
        console.log('Database connected')
    })
    .catch((err) => {
        console.log('Cannot connect to database')
        process.exit()
    })


app.get('/', (req, res) => {
    res.send('<h2>Server is running</h2>')
})

require('./app/routes/admin/user.route')(app)
require('./app/routes/login/login.route')(app)
require('./app/routes/system-entries/entries.route')(app)
require('./app/routes/student/student.route')(app)
require('./app/routes/payments/admission.route')(app)
require('./app/routes/payments/monthly-fee.route')(app)
require('./app/routes/payments/other-payments.route')(app)
require('./app/routes/reports/reports.route')(app)

app.listen(env.PORT, () => {
    console.log('Server is running')
})