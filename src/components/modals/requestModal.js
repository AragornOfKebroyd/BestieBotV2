const { requestsChannel } = require('../../../config.json')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    data: {
        name: 'requestModal'
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `A request has been sent for ***${interaction.fields.getTextInputValue("name")}*** to Ben.`,
            ephemeral: true
        })
        
        Embed = new EmbedBuilder()
            .setTitle(`New Request from **${interaction.user.tag}** for ${interaction.fields.getTextInputValue("name")}`)
            .setColor(client.colour)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
            .addFields([
                {
                    name: 'Description:',
                    value: `${interaction.fields.getTextInputValue("description")}`
                }
            ])
        
        acceptButton = new ButtonBuilder()
            .setCustomId('requestAccept')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success)

        denyButton = new ButtonBuilder()
            .setCustomId('requestDeny')
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger)

        const channel = client.channels.cache.get(requestsChannel) //requests channel in bestie bot testing grounds
        
        await channel.send({
            embeds: [Embed],
            components: [new ActionRowBuilder().addComponents(acceptButton, denyButton)]
        })
    }
}