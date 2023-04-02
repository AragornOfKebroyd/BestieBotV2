const { SlashCommandBuilder } = require('discord.js')
//toDo
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help command'),
		
	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		await interaction.reply({
			content: 'Helppppppppp',
			ephemeral: true
		})
	},
}