const { Schema, model } = require('mongoose')

const birthdaySchema = new Schema({
    _id: Schema.Types.ObjectId,
    Username: String,
    Name: String,
    Date: String,
    Publicity: String,
    CreatedByDiscordId: String
});

//model('name of model', schema, 'collection to save to')
module.exports = model('Birthday', birthdaySchema, 'birthdays');