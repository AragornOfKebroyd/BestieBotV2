const { ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const Subscription = require('../../schemas/subscriptions')
const Birthday = require('../../schemas/birthdays')
const chalk = require('chalk')

module.exports = {
    data: {
        name: 'ButtonBdayExport' //real one is actually BIRTHDAY:type:nextButtonBday:pagenum
    },
    async execute(interaction, client, customId) {
        [command, page] = [customId.split(':')[1], parseInt(customId.split(':')[3])]
        if (command == 'initiate') {
            // set tempexport to empty
            await Subscription.updateOne(
                { DiscordID: interaction.user.id },
                { TempExport: [] })
            page = 0
            replyflag = true
        } else if (command == 'next') {
            page = page + 1
            replyflag = false
        } else if (command == 'prev') {
            page = page - 1
            replyflag = false
        } else if (command == 'export') {
            subscriptionList = await Subscription.find({ DiscordID: interaction.user.id }).select({ TempExport: 1 })
            bdayExports = subscriptionList[0].TempExport
            result = await Birthday.find({ CreatedByDiscordId: interaction.user.id }).select({ Name: 1, Date:1 })
            result = await result.filter(bday => bdayExports.includes(bday._id))

            // clear when exporting
            await Subscription.updateOne(
                { DiscordID: interaction.user.id },
                { TempExport: [] })
            
            console.log(bdayExports)

            //respond
            await interaction.update({
                content: '',
                embeds: [new EmbedBuilder()
                    .setTitle('Exported birthdays')
                    .setDescription('Send this to someone else for them to paste into the import command')
                    .setColor(client.colour)
                    .setTimestamp(Date.now())
                    .setFooter({
                        iconURL: client.user.displayAvatarURL(),
                        text: client.user.tag,
                    })
                    .addFields([{
                        name: 'export:',
                        value: `\`\`\`\n${result.map(birthday => `${birthday.Name}::${birthday.Date}\n`).join('')}\n\`\`\``
                    }])
                ],
                components: [],
                ephemeral: true
            })
            return
        }

        //These 2 lines need to be this way round, otherwise everything goes to shit, i have absolutly no clue why, it makes 0 sense
        subscriptionList = await Subscription.find({ DiscordID: interaction.user.id }).select({ TempExport: 1 })
        result = await Birthday.find({ CreatedByDiscordId: interaction.user.id }).select({ Name: 1, Date: 1 })
        result.sort((a, b) => a.Date.split('/')[1] - b.Date.split('/')[1] || a.Date.split('/')[0] - b.Date.split('/')[0])

        //calculate the number of pages needed
        numOfPages = Math.ceil(result.length / 12)

        Bdayexports = subscriptionList[0].TempExport

        let currentembed = new EmbedBuilder()
            .setTitle(`Birthday Reminders ${page + 1}/${numOfPages}`)
            .setDescription('Select who you do and dont want to be reminded about when it is near or on their birthday')
            .setColor(client.colour)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })

        //make nav buttons
        leftbutton = new ButtonBuilder()
            .setLabel("◀️")
            .setCustomId(`BIRTHDAY:prev:ButtonBdayExport:${page}`)
            .setStyle(ButtonStyle.Primary)

        if (page == 0) {
            leftbutton.setDisabled(true)
        }
        rightbutton = new ButtonBuilder()
            .setLabel("▶️")
            .setCustomId(`BIRTHDAY:next:ButtonBdayExport:${page}`)
            .setStyle(ButtonStyle.Primary)

        enterButton = new ButtonBuilder()
            .setLabel("Export")
            .setCustomId(`BIRTHDAY:export:ButtonBdayExport:0`)
            .setStyle(ButtonStyle.Primary)

        if (page == numOfPages - 1 || numOfPages == 0) {
            rightbutton.setDisabled(true)
        }

        navActionRow = new ActionRowBuilder()
            .addComponents([
                leftbutton,
                rightbutton,
                enterButton
            ])
        //setup other stuff
        //console.log(result)
        var currentpage = []
        currentpage.push(navActionRow)
        currentactionrow = new ActionRowBuilder()
        for (j = 12 * page; j < 12 * page + 12; j++) {
            var person = result[j]
            //console.log("person",person)
            //console.log("res",result)
            //if it is more than there are
            if (j > result.length - 1) {
                //push the current action row
                if (currentactionrow.components.length > 0) {
                    currentpage.push(currentactionrow)
                }
                break
            }
            //add info for embeds
            currentembed.addFields({
                name: `${person.Name}`,
                value: `${person.Date}`,
                inline: true
            })

            //buttons, need to add seeing if they are in your subscription list, then doing success / danger depening on whether they are
            if (Bdayexports.includes(person._id)){
                var currentbutton = new ButtonBuilder()
                    //information that is passed to be buttons has to be done here, special handeler in interactionCreate for BIRTHDAY
                    .setCustomId(`BIRTHDAY:export:birthdayToggle:${page}:${person._id}`)
                    .setLabel(`${person.Name}`)
                    .setStyle(ButtonStyle.Success)
            } else {
                var currentbutton = new ButtonBuilder()
                    .setCustomId(`BIRTHDAY:export:birthdayToggle:${page}:${person._id}`)
                    .setLabel(`${person.Name}`)
                    .setStyle(ButtonStyle.Danger)
            }

            currentactionrow.addComponents(currentbutton)
            //if the action row is full
            if (currentactionrow.components.length == 3) {
                currentpage.push(currentactionrow)
                currentactionrow = new ActionRowBuilder()
            }
        }
        if (replyflag == true) {
            await interaction.reply({
                content: "Birthdays",
                ephemeral: true,
                embeds: [currentembed],
                components: currentpage,
                fetchReply: true
            })
        } else {
            await interaction.update({
                embeds: [currentembed],
                components: currentpage
            })
        }
    }
}