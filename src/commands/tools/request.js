const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('request')
		.setDescription('Request a feature for Bestie Bot!'),
        
	async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId('requestModal')
            .setTitle('Request Form.')

        const name = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Name of the Feature')
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
        
        const explanation = new TextInputBuilder()
            .setCustomId('description')
            .setLabel('A short description of the feature')
            .setStyle(TextInputStyle.Paragraph)
        
        modal.addComponents(new ActionRowBuilder().addComponents(name), new ActionRowBuilder().addComponents(explanation))
        
        await interaction.showModal(modal)
	},
}