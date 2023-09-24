const { EmbedBuilder } = require("discord.js")
const mongoose = require('mongoose')
const Birthday = require('../../schemas/birthdays')
const chalk = require('chalk')

module.exports = {
    data: {
        name: 'importModal'
    },
    async execute(interaction, client) {
        const input = interaction.fields.getTextInputValue("importText")
        const items = input.split('\n')
        
        let output = ''
        let tryagain = ''

        for (birthday of items) {
            //validation
            split_bday = birthday.split('::')
            if (birthday == '') continue //incase there was an empty line in there
            if (split_bday.length != 2) {
                await exitscript(interaction)
                return
            }
            let [name, date] = split_bday
            split_date = date.split('/')
            if (split_date.length != 2) {
                await exitscript(interaction)
                return
            }
            [day, month] = split_date
            if (isNaN(Number(month)) || isNaN(Number(day))) {
                await exitscript(interaction)
                return
            }
            [day, month] = [Number(day), Number(month)]
            if (month > 12 || day > 31 || month < 1 || day < 1) {
                await exitscript(interaction)
                return
            }
            name = name.replace(/[^\x00-\x7F]/g, "") // get rid of non ascii
            //add
            outcome = await addBirthday(interaction, client, name, date)
            output += `**${name}** : ${outcome}\n`
            if (outcome !== 'success (Added)'){
                tryagain += `${isNaN(Number(name[name.length-1])) ? `${name}1` : `${name.slice(0,name.length-2)}${Number(name[name.length-1])+1}`}::${date}\n`
            }
        }

        embed = new EmbedBuilder()
            .setTitle('Import Finnished')
            .setDescription(output)
            .setColor(client.colour)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
        if (tryagain !== '') {
            embed.addFields({
                name:'If you want to try again on the errored imports, here is a suggestion',
                value: `\`\`\`\n${tryagain}\n\`\`\``
            })
        }

        await interaction.reply({
            content: '',
            embeds: [embed],
            ephemeral: true
        })
    },
    exitscript,
    addBirthday
}
async function exitscript(interaction) {
    await interaction.reply({
        content: 'Incorrect Formatting\nNo birthdays added.',
        ephemeral: true
    })
}

async function addBirthday(interaction, client, name, date) {
    //check if anyone with the same name is allready in the colleciton
    result = await Birthday.find({ Name: name })
    if (result.length > 0) {
        //if it is not a private name that is being duped, there can be multiple private things with the same name
        CreatedBy = result[0].CreatedByDiscordId
        if (CreatedBy == interaction.user.id) {
            return 'duplicate name (Not Added)'
        }
    }

    //make new birthday item to add to colleciton
    brithdayItem = await new Birthday({
        _id: mongoose.Types.ObjectId(),
        Name: name,
        Date: date,
        CreatedByDiscordId: interaction.user.id
    })

    //save
    await brithdayItem.save().catch(err => {
        console.error(err)
        return 'errored (Not Added)'
    })

    console.log(chalk.blue(`[Database]: Person: ${name} has been added to the birthdays colleciton`))
    return 'success (Added)'
}