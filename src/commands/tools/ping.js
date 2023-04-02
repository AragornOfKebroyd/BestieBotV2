const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('What is your ping?'),
		
	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		//defer reply to something we will do afterwards
		const message = await interaction.deferReply({
			fetchReply: true
		})

		//get latency and ping in message
		const newMessage = `API Latency: ${client.ws.ping}\nClient Ping: ${message.createdTimestamp - interaction.createdTimestamp}`
		await interaction.editReply({
			content: newMessage,
			ephemeral: true
		})
	},
}