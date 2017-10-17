'use strict'

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sortAnswers = function(a, b) {
  // return - negative a before b
  // return 0 order don't change
  // return + positive a after b
  if(a.updatedAt === b.updatedAt) {
    return b.updatedAt - a.updatedAt   // this will order the latest date first or the larger date first
  }
  return b.votes - a.votes
}

const AnswersSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  votes: {type: Number, default: 0 }
})

// let's think about when the answer is updated: we want to applied the answers to unanswered document
// we need the instace method called update
AnswersSchema.method("update", function(updates, callback) {
  // merge the updates into the answer document using object.assign
  Object.assign( this, updates, { updatedAt: new Date() })
  // save the parent document, to access the question we can use the answers parent method
  this.parent().save(callback)
})

// we need a vote instace method to help with translating strings from URL into math that moves the counts up or down
AnswersSchema.method("vote", function(vote, callback){
  if(vote === "up") {
    this.votes += 1
  } else {
    this.votes -= 1
  }
  this.parent().save(callback)
})

const QuestionSchema = new Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  answers: [ AnswersSchema ]
})
// To save the child must save the parent first , to do that we need pre-save hook: callback on the parent dchema.
QuestionSchema.pre("save", function(next){
  this.answers.sort(sortAnswers)
  next()
})

module.exports.Question = mongoose.model("Question", QuestionSchema)
