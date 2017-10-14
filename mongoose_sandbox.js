'use strict';

const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/sandbox") // sandbox is the data base name optional
const db = mongoose.connection

db.on('error', (err) => {
  console.error('connection error:', err)
})
// once event is emited when the connection is ready to go. I tis means that the coonnection to the mongodb is open and
// it 's ready to talk
db.once("open", () => {
  console.log("db connection successful")
  // All database comunication gose here
  const Schema = mongoose.Schema

  const AnimalSchema = new Schema({
    type: String,
    size: String,
    color: String,
    mass: Number,
    name: String
  })

  const Animal = mongoose.model("Animal", AnimalSchema)

  const elephant = new Animal({
    type: "elephant",
    size: "big",
    color: "gray",
    mass: 6000,
    name: "Lowrence"
  })

  elephant.save((err) => {
    if (err) console.error("Save Failed", err)
    else console.log("Saved!") // When the object document saved then the call back fired then the db will close
    db.close(() => {
      console.log("db connection closed!")
    })
  })


})
