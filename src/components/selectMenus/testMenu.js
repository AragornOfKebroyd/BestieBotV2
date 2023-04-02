module.exports = {
    data: {
        name: 'testMenu'
    },
    async execute(interaction, client){
        await interaction.reply({
            content: `You selected ${interaction.values[0]}`,
            ephemeral: true //only the person that does it can see it
        })
    }
}