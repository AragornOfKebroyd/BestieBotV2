const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: {
        name: 'requestAccept'
    },
    async execute(interaction, client) {
        resendEmbed = interaction.message.embeds[0]
        resendEmbed.data.color = `${parseInt(client.green)}`

        await interaction.message.edit({
            components: [],
            embeds: [resendEmbed],
            content: 'Request Accepted'
        })

        //set it back to base colour
        resendEmbed.data.color = `${parseInt(client.colour)}`
        resendEmbed.data.title = resendEmbed.data.title.replace("New Request", "Accepted Request")

        //send in accepted requests channel
        const channel = client.channels.cache.get('1071572707457638430') //accepted requests channel in bestie bot testing grounds

        remove = new ButtonBuilder()
            .setCustomId('requestRemove')
            .setLabel('Not Doing⛔')
            .setStyle(ButtonStyle.Danger)
        
        markasinprogress = new ButtonBuilder()
            .setCustomId('requestInprogress')
            .setLabel('In Progress▶️')
            .setStyle(ButtonStyle.Primary)

        markasdone = new ButtonBuilder()
            .setCustomId('requestDone')
            .setLabel('Done✅')
            .setStyle(ButtonStyle.Success)

        channel.send({
            embeds: [resendEmbed],
            components: [new ActionRowBuilder().addComponents(remove, markasinprogress, markasdone)]
        })
    }
}