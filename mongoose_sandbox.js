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
    type: { type: String, default: "goldfish" },
    size: { type: String, default: "small" },
    color: { type: String, default: "golden" },
    mass: { type: Number, default: 0.007 },
    name: { type: String, default: "Angela" }
  })

  const Animal = mongoose.model("Animal", AnimalSchema)

  const elephant = new Animal({
    type: "elephant",
    size: "big",
    color: "gray",
    mass: 6000,
    name: "Lowrence"
  })

  const animal = new Animal({})  // create a generic animal means here goldfish // by passing an empty object to the Animal model

  Animal.remove({}, (err) => {
    if (err) console.error(err)
      elephant.save((err) => {
        if (err) console.error(err)
          animal.save((err) => {
            if (err) console.error(err)
            db.close(() => {
              console.log("db connection closed!")
            })
          })
        })
      })  // empty Animal model collection before we save any thing



})
