const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help command'),
	async execute(interaction, client) {
		await interaction.reply('go away nerd');
	},
};