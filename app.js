const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const feedRoutes = require('./routes/feed')

// app.use(bodyParser.urlencoded({})) // x-www-form-urlencoded
app.use(bodyParser.json()) //application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATHCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    next()
})
app.use('/feed', feedRoutes)

app.listen(8080)