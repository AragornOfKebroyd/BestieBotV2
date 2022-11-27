const cron = require('node-cron')
const yaml = require('js-yaml');
const path = require('node:path');
const fs = require('node:fs');

module.exports = {
    cronInit() {
        checkforbirthdays(readYaml())//temporary for testing
        //Runs at 7am each morning
        cron.schedule('0 7 * * *', function() {
            yml = readYaml()
            checkforbirthdays(yml)
        });
    },
    
}
function readYaml() {
    yamlPath = path.join(__dirname, 'birthdays.yaml');
    const yamlFile = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
    console.log(yamlFile)
    return yamlFile
}

function checkforbirthdays(yamlFile) {
    let today = new Date();
    for (person in yamlFile.birthdays) {
        console.log(yamlFile.birthdays[person].date)
        birthday = new Date(yamlFile.birthdays[person].date+" 12:00:00") //daylight savings is a pain in the buttocks so midday means it doesnt interferee
        console.log(birthday)
        thisyear = birthday
        thisyear.setFullYear(today.getFullYear())
        console.log(thisyear)
        diff = thisyear.getTime() - today.getTime()
        console.log(diff)
    }
}