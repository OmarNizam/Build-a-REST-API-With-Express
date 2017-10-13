'use strict';

const express = require('express')
const jsonParser = require('body-parser').json
const app = express()
const routes = require('./routes')
const logger = require('morgan')

app.use(logger("dev"))
app.use(jsonParser())

app.use('/questions', routes)



const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('Express server is listening to port :', port);
})
