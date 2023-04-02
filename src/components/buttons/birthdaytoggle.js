const { ButtonStyle } = require('discord.js')
const Subscription = require('../../schemas/subscriptions')
const chalk = require('chalk')
const { testfunc } = require('../../commands/tools/birthday')

module.exports = {
    data: {
        name: 'birthdayToggle'
    },
    async execute(interaction, client, customId) {
        const broken = customId.split(':')
        command = broken[1]
        //get msg to change
        newmessage = interaction.message

        //to change the button that was pressed
        const idCheck = customId.split(':')[4]
        for (actionrow of newmessage.components){
            for (button of actionrow.components){
                buttonPerson = button.data.custom_id.split(':')[4]
                if (buttonPerson == idCheck){
                    style = button.data.style
                    if (style == 3){
                        button.data.style = 4
                    } else {
                        button.data.style = 3
                    }
                    if (command == 'default'){
                        PeopleRems(interaction, idCheck)
                    } else if (['OnDay', 'DayBefore', 'WeekBefore', 'ThisMonth'].includes(command)) {
                        FrequencyRems(interaction, command)
                    }
                }
            }
        }
        // Respond to the interaction
        interaction.update({
            components: newmessage.components 
        })
    },
    PeopleRems,
    FrequencyRems
}

async function PeopleRems(interaction, idCheck){
    subscriptionList = await Subscription.find({ DiscordID: interaction.user.id })
    reminders = subscriptionList[0].RemindersArray
    username = subscriptionList[0].Username
    
    //update db
    if (reminders.includes(idCheck)){
        //remove it
        reminders.pull(idCheck)
    } else{
        //add it
        reminders.push(idCheck)
    }
    Subscription.findOneAndUpdate({ DiscordID : interaction.user.id }, { RemindersArray: reminders }, function(err,res){
        if (err){
            console.error(err)
            console.log(chalk.red(`[Database]: ${username} Failed to update in birthday collection.`))
            return
        } else{
            console.log(chalk.blue(`[Database]: ${username} Updated in birthday collection.`))
            return
        }
    })
}


async function FrequencyRems(interaction, command){
    reminders = await Subscription.find({ DiscordID: interaction.user.id })
    username = reminders[0].Username

    switch (command) {
        case 'OnDay':
            Subscription.findOneAndUpdate({ DiscordID : interaction.user.id }, { OnDayReminder: !(reminders[0].OnDayReminder) }, function(err,res){
                if (err){
                    console.error(err)
                    console.log(chalk.red(`[Database]: ${username} Failed to update in birthday collection.`))
                    return
                } else{
                    console.log(chalk.blue(`[Database]: ${username} Updated in birthday collection.`))
                    return
                }
            })
            break
        case 'DayBefore':
            Subscription.findOneAndUpdate({ DiscordID : interaction.user.id }, { DayBeforeReminder: !(reminders[0].DayBeforeReminder) }, function(err,res){
                if (err){
                    console.error(err)
                    console.log(chalk.red(`[Database]: ${username} Failed to update in birthday collection.`))
                    return
                } else{
                    console.log(chalk.blue(`[Database]: ${username} Updated in birthday collection.`))
                    return
                }
            })
            break
        case 'WeekBefore':
            Subscription.findOneAndUpdate({ DiscordID : interaction.user.id }, { WeekBeforeReminder: !(reminders[0].WeekBeforeReminder) }, function(err,res){
                if (err){
                    console.error(err)
                    console.log(chalk.red(`[Database]: ${username} Failed to update in birthday collection.`))
                    return
                } else{
                    console.log(chalk.blue(`[Database]: ${username} Updated in birthday collection.`))
                    return
                }
            })
            break
        case 'ThisMonth':
            Subscription.findOneAndUpdate({ DiscordID : interaction.user.id }, { ThisMonthReminder: !(reminders[0].ThisMonthReminder) }, function(err,res){
                if (err){
                    console.error(err)
                    console.log(chalk.red(`[Database]: ${username} Failed to update in birthday collection.`))
                    return
                } else{
                    console.log(chalk.blue(`[Database]: ${username} Updated in birthday collection.`))
                    return
                }
            })
            break
        default:
            break
    }
}