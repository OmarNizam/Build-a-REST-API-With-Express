'use strict';

var express = require('express')
var router = express.Router()
var Question = require('./models').Question

// Express allows us to trigger a handler whenever the URL parameter is present on any matchiong route.
router.param("qID", function(req, res, next, id) { // param method take two parameters first our route as String and the another is call back method // id is the value from the route parameter
  Question.findById(id, function(err, doc) {
    if(err) return next(err)
    if(!doc){
      err = new Error('Not Found')
      err.status = 404
      next(err)
    }
    req.question = doc
    next()
  })
})

router.param("aID", function(req, res, next, id) {
  req.answer = req.question.answers.id(id)  // the ID method take sub-document ID and returns that sub-document with that matching ID
  if(!req.answer){
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  }
  next()
})

// GET /questions
// route for questions collection
router.get('/', (req, res, next) => {
  Question.find({})                    // find all questions
              .sort({ updatedAt: -1 }) // sort the result
              .exec(function(err, questions) {   // this execute the query and called the callback function
                if(err) return next(err)
                res.json(questions)         // mongoose allows us to pass the document into json file
              })
})

// POST /questions
// router for creating questions
router.post('/', (req, res, next) => {
  var question = new Question(req.body)
  question.save(function(err, question) {
    if(err) return next(err)
    res.status(201)  // to indicate that the question saved successfully
    res.json(question)
  })
})

// GET /questions:qID
// route for a specific question
router.get('/:qID', (req, res, next) => {
    res.json(req.question)
  })


// POST /questions:qID/answers
// route to create answers for a specific question
router.post('/:qID/answers', (req, res, next) => {
  req.question.answers.push(req.body)
  req.question.save(function(err, question) {
    if(err) return next(err)
    res.status(201)  // to indicate that the question saved successfully
    res.json(question)
  })
})

// PUT /questions/:qID/answers/:aID
// Edit or update a specific answer
router.put('/:qID/answers/:aID', (req, res, next) => {
  req.answer.update(req.body, function(err, result) {
    if(err) return next(err)
    res.json(result)
  })
})

// DELETE /questions/:qID/answers/:aID
// delete a specific answer
router.delete('/:qID/answers/:aID', (req, res, next) => {
  req.answer.remove(function(err) {
    req.question.save(function(err, question) {
      if(err) return next(err)
      res.json(question)
    })
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
    req.vote = req.params.dir
    next()
  }
}, (req, res, next) => {  // dir here is direction
  req.answer.vote(req.vote, function(err, question) {
    if(err) return next(err)
    res.json(question)
  })
})

module.exports = router;
