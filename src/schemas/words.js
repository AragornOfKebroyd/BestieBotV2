const { Schema, model } = require('mongoose')

const wordSchema = new Schema({
    _id: Number,
    ID: Number,
    Word: String,
    Type: String,
    Description: String,
    Frequency: Number,
    wordType: String,
    LikeDislike: String
})

//model('name of model', schema, 'collection to save to')
module.exports = model('Word', wordSchema, 'Words')