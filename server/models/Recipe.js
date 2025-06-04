const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  imageUrl: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author : {
   type : mongoose.Schema.ObjectId,
   ref:'User',
   required:true

  }
})

module.exports = mongoose.model('Recipe', recipeSchema)
