const { Schema, model } = require('mongoose')

const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Username: String,
    DiscordID: Int16Array,
    RemindersArray: Array,
    ThisMonthReminder: Boolean,
    WeekBeforeReminder: Boolean,
    DayBeforeReminder: Boolean,
    OnDayReminder: Boolean
});

//model('name of model', schema, 'collection to save to')
module.exports = model('User', guildSchema, 'subscriptions');