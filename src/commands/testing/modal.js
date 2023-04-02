const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modal')
		.setDescription('idrk tbh'),
        
	async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('testModal')
            .setTitle('Favourite Colour?')

        const textInput = new TextInputBuilder()
            .setCustomId('favColourInput')
            .setLabel('Whats your favourite colour?')
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        
        modal.addComponents(new ActionRowBuilder().addComponents(textInput))

        await interaction.showModal(modal)
	},
}