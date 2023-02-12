module.exports = {
    data: {
        name: 'requestRemove'
    },
    async execute(interaction, client) {
        await interaction.message.delete()
    }
}