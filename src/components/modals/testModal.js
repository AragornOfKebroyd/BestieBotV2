module.exports = {
    data: {
        name: 'testModal'
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `You said your favourite colour was ${interaction.fields.getTextInputValue("favColourInput")}`
        })
    }
}