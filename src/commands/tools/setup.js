const { SlashCommandBuilder } = require('discord.js');
//toDo
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('help command'),
		
	async execute(interaction, client) {
		await interaction.reply({
			content: 'Helppppppppp',
			ephemeral: true
		});
	},
};