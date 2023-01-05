const cron = require('node-cron')
const fs = require('node:fs');
const mongoose = require('mongoose')
const Birthday = require('../../schemas/birthdays')

module.exports = {
    cronInit(client) {
        main()
        //Runs at 7am each morning
        cron.schedule('0 7 * * *', function() {
            main(client)
        });
    }
}
/*
Calculate the date at which is 7 days from now, one day from now and today
*/

async function main(client){
    var [todaydate, tomorrowDate, weekDate] = datesCalc()
    BirthdayToday = await Birthday.find({ Date:todaydate }).select({ _id: 1, Name: 1 })
    BirthdayTomorrow = await Birthday.find({ Date:tomorrowDate }).select({ _id: 1, Name: 1 })
    BirthdayInWeek = await Birthday.find({ Date:weekDate }).select({ _id: 1, Name: 1 })
}


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