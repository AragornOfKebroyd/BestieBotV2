const { Schema, model } = require('mongoose')

const subscriptionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    Username: String,
    DiscordID: String,
    RemindersArray: Array,
    ThisMonthReminder: Boolean,
    WeekBeforeReminder: Boolean,
    DayBeforeReminder: Boolean,
    OnDayReminder: Boolean,
    Muted: Boolean,
    TempExport: Array
})

//model('name of model', schema, 'collection to save to')
module.exports = model('User', subscriptionSchema, 'subscriptions')