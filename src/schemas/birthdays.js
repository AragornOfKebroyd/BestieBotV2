const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Username: String,
    Name: String,
    Date: Date
});

//model('name of model', schema, 'collection to save to')
module.exports = model('Birthday', guildSchema, 'birthdays');