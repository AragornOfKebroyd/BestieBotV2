const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('User Info!'),
		
	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		await interaction.reply({
			content: `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`,
			ephermeral: true
		})
	},
}