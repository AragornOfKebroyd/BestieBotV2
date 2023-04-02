module.exports = {
    data: {
        name: 'githubLink'
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: 'https://github.com/AragornOfKebroyd',
            ephemeral: true
        })
    }
}