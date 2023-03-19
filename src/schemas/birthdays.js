const { Schema, model } = require('mongoose')

const birthdaySchema = new Schema({
    _id: Schema.Types.ObjectId,
    Name: String,
    Date: String,
    CreatedByDiscordId: String
});

//model('name of model', schema, 'collection to save to')
module.exports = model('Birthday', birthdaySchema, 'birthdays');