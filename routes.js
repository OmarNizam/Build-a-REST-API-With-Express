'use strict';

var express = require('express')
var router = express.Router()
var Question = require('./models')
// GET /questions
// route for questions collection
router.get('/', (req, res) => {
  res.json({
    response: "You send me a GET request "
  })
})

// POST /questions
// router for creating questions
router.post('/', (req, res) => {
  res.json({
    response: "Yoy send me a POST request",
    body: req.body
  })
})

// GET /questions:qID
// route for a specific question
router.get('/:qID', (req, res) => {
  res.json({
    response: "You send me a GET request for ID" + req.params.qID
  })
})

// POST /questions:qID/answers
// route to create answers for a specific question
router.post('/:qID/answers', (req, res) => {
  res.json({
    response: "You send me a POST to /answers",
    questionId: req.params.qID,
    body: req.body
  })
})

// PUT /questions/:qID/answers/:aID
// Edit or update a specific answer
router.put('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: "You send me a PUT to /answers ",
    questionId: req.params.qID,
    answerId: req.params.aID,
    body: req.body
  })
})

// DELETE /questions/:qID/answers/:aID
// delete a specific answer
router.delete('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: "You send me a DELETE answer to /answers",
    questionId: req.params.qID,
    answerId: req.params.aID
  })
})

// POST /questions/:qID/answers/:aID/vate-up
// POST /questions/:qID/answers/:aID/vate-down
// Vote on a specific answer
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
  if(req.params.dir.search(/^(up|down)$/) === -1) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  } else {
    next()
  }
}, (req, res) => {  // dir here is direction
  res.json({
    response: "You send me a POST request to /vote-" + req.params.dir,
    questionId: req.params.qID,
    answerId: req.params.aID,
    vote: req.params.dir
  })
})

module.exports = router;
