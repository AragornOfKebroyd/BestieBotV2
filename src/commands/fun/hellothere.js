const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hellothere')
		.setDescription('yknow, say hello there'),
        
	async execute(interaction, client) {
        await interaction.reply({
            content: 'General Kenobi'
        })
	}
}