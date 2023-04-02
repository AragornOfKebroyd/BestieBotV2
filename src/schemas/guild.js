const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    guildIcon: { type: String, required: false },
    Xs: Boolean,
    Hello: Boolean,
    ChannelID: String, //can be an id, a list of comma deliminated IDs, -1 to denote all channels, or 0 to denote none
    AllowedRoles: String
})

//model('name of model', schema, 'collection to save to')
module.exports = model('Guild', guildSchema, 'guilds')