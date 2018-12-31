const env = require('./app/configuration/environment.config')

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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

app.listen(env.PORT, () => {
    console.log('Server is running')
})