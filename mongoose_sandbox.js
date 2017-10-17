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
    size: String,
    color: { type: String, default: "golden" },
    mass: { type: Number, default: 0.007 },
    name: { type: String, default: "Angela" }
  })
  // save the size property for each animal dynamically before saveing them to the data base
  // mongoose offer for that something called pre-save hook and it give us an opportunity to do something to document before it is saved.
  // we can take advantage of this opportunity by writing Mongoose specific Meddileware
  // pre method on the Schema
  AnimalSchema.pre("save", function (next) {
    if(this.mass >= 100) {
      this.size = "big"
    } else if( this.mass >= 5 && this.mass < 100) {
      this.size = "medium"
    } else {
      this.size = "small"
    }
    next()
  })
// statics method : custom function it can called on the model directly to help us access our datain custom way
  AnimalSchema.statics.findSize = function(size, callback) {
    // this === Animal
    return this.find({size: size}, callback)
  }

  const Animal = mongoose.model("Animal", AnimalSchema)

  const animal = new Animal({})  // create a generic animal means here goldfish // by passing an empty object to the Animal model

  const elephant = new Animal({
    type: "elephant",
    color: "gray",
    mass: 6000,
    name: "Lowrence"
  })

  const wheal = new Animal({
    type: "wheal",
    mass: 190500,
    name: "Fig"
  })

  const animalData = [
    {
      type: "mouse",
      color: "gray",
      mass: 0.035,
      name: "Marvin"
    },
    {
      type: "nutria",
      color: "brown",
      mass: 6.35,
      name: "Gretchen"
    },
    {
      type: "wolf",
      color: "gray",
      mass: 45,
      name: "Iris"
    },
    elephant,
    animal,
    wheal
  ]





  Animal.remove({}, (err) => {
    if (err) console.error(err)
    Animal.create(animalData, (err, animals) => {
      if (err) console.error(err)
      Animal.findSize("medium", (err, animals) => {  // the query will return all objects
        animals.forEach((animal) => {
          console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-sized animal.")
        })
        db.close(() => {
          console.log("db connection closed!")
        })
      })
    })
  })
})
