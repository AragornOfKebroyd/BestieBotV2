module.exports = {
    data: {
        name: 'requestInprogress'
    },
    async execute(interaction, client) {
        //change message
        message = interaction.message
        embed = message.embeds[0]
        embed.data.colour = `${parseInt(0x0055b3)}`

        buttons = message.components[0]
        for (button of buttons.components){
            if (button.data.custom_id == "requestInprogress"){
                button.data.disabled = true
            } else {
                button.data.disabled = false
            }
        }
        await interaction.update({
            content: '`In Progress▶️`',
            embeds: [embed],
            components: [buttons]
        })
    }
}