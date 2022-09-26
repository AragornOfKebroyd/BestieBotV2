const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('User Info!'),
	async execute(interaction) {
		await interaction.reply('idk!');
	},
};