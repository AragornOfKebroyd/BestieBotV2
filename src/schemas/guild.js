const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    guildIcon: { type: String, required: false },
    Xs: Boolean,
    Hello: Boolean
});

//model('name of model', schema, 'collection to save to')
module.exports = model('Guild', guildSchema, 'guilds');