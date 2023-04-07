const { mongoose } = require('mongoose')
const cron = require('node-cron')
const fs = require('node:fs')
const Birthday = require('../../schemas/birthdays')
const Subscription = require('../../schemas/subscriptions')

module.exports = {
    cronInit(client) {
        //main(client)//for testing purposes
        //Runs at 7am each morning
        cron.schedule('0 7 * * *', function() {
            main(client)
        })
    }
}

async function main(client){
    var [todaydate, tomorrowDate, weekDate] = datesCalc()
    BirthdayToday = await Birthday.find({ Date:todaydate }).select({ _id: 1, Name: 1 })
    BirthdayTomorrow = await Birthday.find({ Date:tomorrowDate }).select({ _id: 1, Name: 1 })
    BirthdayInWeek = await Birthday.find({ Date:weekDate }).select({ _id: 1, Name: 1 })
    //Month function not working yet, do later
    //console message to say a message has been sent
    for (bday of BirthdayToday){
        const [ _id, Name ] = [`${bday._id}`, bday.Name]
        mailingList = await Subscription.find({ RemindersArray: { $all : [_id] }})
        for (person of mailingList){
            const { OnDayReminder, Muted } = person
            if (OnDayReminder == false || Muted == true){
                return
            }
            await client.users.fetch(person.DiscordID, false).then((user) => {
                user.send(`It's ${Name}'s birthday today!`)
            })
        }
    }
    for (bday of BirthdayTomorrow){
        const [ _id, Name ] = [`${bday._id}`, bday.Name]
        mailingList = await Subscription.find({ RemindersArray: { $all : [_id] }})
        for (person of mailingList){
            const { DayBeforeReminder, Muted } = person
            if (DayBeforeReminder == false || Muted == true){
                return
            }
            await client.users.fetch(person.DiscordID, false).then((user) => {
                user.send(`It's ${Name}'s birthday tommorow!`)
            })
        }
    }
    for (bday of BirthdayInWeek){
        const [ _id, Name ] = [`${bday._id}`, bday.Name]
        mailingList = await Subscription.find({ RemindersArray: { $all : [_id] }})
        for (person of mailingList){
            const { WeekBeforeReminder, Muted } = person
            if (WeekBeforeReminder == false || Muted == true){
                return
            }
            await client.users.fetch(person.DiscordID, false).then((user) => {
                user.send(`It's ${Name}'s birthday in 1 week!`)
            })
        }
    }
}

//Calculate the date at which is 7 days from now, one day from now and today
function datesCalc(){
    //set the date today and set time to 7:00am
    today = new Date()
    today.setHours(7, 0, 0, 0)
    //find dates in one day and one week
    oneDay = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)
    oneWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    dates = []
    for (datetime of [today, oneDay, oneWeek]){
        //plus one because today.getMonth returns a value between 0 and 11
        dateformatted = `${datetime.getDate()}/${datetime.getMonth()+1}`
        dates.push(dateformatted)
    }
    return dates
}