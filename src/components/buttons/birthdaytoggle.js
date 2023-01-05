const { ButtonStyle } = require('discord.js')
const Subscription = require('../../schemas/subscriptions')
const chalk = require('chalk')

module.exports = {
    data: {
        name: 'birthdayToggle'
    },
    async execute(interaction, client, person) {
        //get current reminders
        subscriptionList = await Subscription.find({ DiscordID: interaction.user.id }).select({ Username: 1, RemindersArray : 1, _id : 0})
        reminders = subscriptionList[0].RemindersArray
        username = subscriptionList[0].Username


        // Change the style of received button component
        newmessage = interaction.message
        for (actionrow of newmessage.components){
            for (button of actionrow.components){
                if (button.data.custom_id.replace('BIRTHDAY','') == person){
                    style = button.data.style
                    if (style == 3){
                        button.data.style = 4
                    } else {
                        button.data.style = 3
                    }
                    
                    //replace
                    try {
                        if (reminders.includes(person)){
                            //remove it
                            reminders.pull(person)
                        } else{
                            //add it
                            reminders.push(person)
                        }
                        console.log(person, username)
                        Subscription.findOneAndUpdate({ DiscordID : interaction.user.id }, { RemindersArray: reminders }, function(err,res){
                            if (err) return console.error(err)
                            return
                        })
                        console.log(chalk.blue(`[Database]: ${username} Updated in birthday collection.`))
                    } catch (error) {
                        console.log(chalk.red(`[Database]: ${username} Failed to update in birthday collection.`))
                    }   
                }
            }
        }
        // Respond to the interaction
        interaction.update({
            content:'no way',
            components: newmessage.components 
        });
    }
}