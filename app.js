'use strict';

const express = require('express')
const jsonParser = require('body-parser').json
const app = express()
const routes = require('./routes')
const logger = require('morgan')

app.use(logger("dev"))
app.use(jsonParser())

app.use('/questions', routes)

// catch 404 error and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  res.status = ( err.status || 500 )
  res.json({
    error: {
      message: err.message
    }
  })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Express server is listening to port :', port);
})
