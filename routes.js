'use strict';

var express = require('express')
var router = express.Router()

// GET /questions
// route for questions collection
router.get('/', (req, res) => {
  res.json({
    response: "You send me a GET request "
  });
})

// POST /questions
// router for creating questions
router.post('/', (req, res) => {
  res.json({
    response: "Yoy send me a POST request"
  });
})

// GET /questions/:id
// route for a specific question
router.get('/:id', (req, res) => {
  res.json({
    response: "You send me a GET request for ID" + req.params.id
  })
})

module.exports = router
