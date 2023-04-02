module.exports = {
    data: {
        name: 'requestDeny'
    },
    async execute(interaction, client) {
        embed = interaction.message.embeds[0]
        embed.data.color = `${parseInt(client.red)}`
        
        await interaction.message.edit({
            components: [],
            embeds:[embed],
            content: 'Request Denied'
        })
    }
}