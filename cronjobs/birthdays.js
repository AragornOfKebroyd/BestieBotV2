const cron = require('node-cron')
const yaml = require('js-yaml');
const path = require('node:path');
const fs = require('node:fs');
const index = require(path.join(__dirname, "..", "/index.js"))


module.exports = {
    cronInit() {
        main()
        //Runs at 7am each morning
        cron.schedule('0 7 * * *', function() {
            main()
        });
    }
}


function main() {
    yml = readYaml()
    daysUntillBdaysList = daysUntillBirthdays(yml)
    messagestuff = calculateMailingList(daysUntillBdaysList)
    messagePeople(yml,messagestuff)
}


function readYaml() {
    //reads the yaml file and returns as a javascript object
    yamlPath = path.join(__dirname, 'birthdays.yaml');
    const yamlFile = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
    //console.log(yamlFile)
    return yamlFile
}


function daysUntillBirthdays(yamlFile) {
    //calculate how many days untill everyones birthdays and returns a dict
    let today = new Date()
    today.setHours(7, 0, 0)
    daysUntill = {}
    for (person in yamlFile.birthdays) {

        //daylight savings is a pain in the buttocks so 7:00 means it doesnt interferee
        birthday = new Date(yamlFile.birthdays[person].date+" 7:00:00") 
        thisyear = birthday
        thisyear.setFullYear(today.getFullYear())
        //difference between 2 days in milliseconds
        difference = Math.round((thisyear.getTime() - today.getTime())/(1000*60*60*24),1) //milliseconds to days

        //It is next year
        if (difference < 0) {
            thisyear.setFullYear(today.getFullYear()+1)
        }

        difference = Math.round((thisyear.getTime() - today.getTime())/(1000*60*60*24),1) //milliseconds to days
        daysUntill[person] = difference
    }
    return daysUntill
}


function calculateMailingList(Bdays) {
    seven = []
    one = []
    today = []
    for (const [person, bdaydays] of Object.entries(Bdays)) {
        switch (bdaydays) {
            case (7):{
                seven.push(person)
                break
            }
            case(1):{
                one.push(person)
                break
            }
            case(0):{
                today.push(person)
                break
            }
        }
    }
    //returns lists of people whos birthday it is in 1 week, 1 day and today
    return [seven, one, today]
}


function messagePeople(yamlFile, birthdays) {
    for (const [username, data] of Object.entries(yamlFile.mailingrecipients)) {
        id = data["id"]
        preferences = data["preferences"]
        //in 1 week
        if (birthdays[0] != []) {
            if (preferences.includes("weekbefore")) {
                for (birthday of Object.entries(birthdays[0])) {
                    index.DirectMessage(id, `it is ${birthday[1]}s birthday in 1 week`)
                }
            }
        }
        //tomorrow
        if (birthdays[1] != []) {
            if (preferences.includes("daybefore")) {
                for (birthday of Object.entries(birthdays[1])) {
                    index.DirectMessage(id, `it is ${birthday[1]}s birthday tomorrow`)
                }
            }
        }
        //today
        if (birthdays[2] != []) {
            if (preferences.includes("onday")) {
                for (birthday of Object.entries(birthdays[2])) {
                    index.DirectMessage(id, `it is ${birthday[1]}s birthday today!`)
                }
            }
        }
    }
}