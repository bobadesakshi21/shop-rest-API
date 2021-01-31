const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const feedRoutes = require('./routes/feed')

const app = express()

const MONGODB_URI = 'mongodb+srv://Sakshi:sakshi123@cluster0.vpzlm.mongodb.net/messages?retryWrites=true&w=majority'

// app.use(bodyParser.urlencoded({})) // x-www-form-urlencoded
app.use(bodyParser.json()) //application/json

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATHCH')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})
app.use('/feed', feedRoutes)

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(3000)
  })
  .catch(err => {
    console.log('CONNECTION ERR', err)
  })

app.listen(8080)