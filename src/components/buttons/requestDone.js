module.exports = {
    data: {
        name: 'requestDone'
    },
    async execute(interaction, client) {
        //change message
        message = interaction.message
        embed = message.embeds[0]
        embed.data.colour = `${parseInt(client.green)}`

        await interaction.update({
            content: '`Done!✅`',
            embeds: [embed],
            components: []
        })
    }
}