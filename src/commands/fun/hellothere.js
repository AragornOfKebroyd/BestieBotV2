const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hellothere')
		.setDescription('yknow, say hello there'),
        
	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
        await interaction.reply({
            content: 'General Kenobi'
        })
	}
}