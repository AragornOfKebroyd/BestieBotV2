const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('getAvatar')
		.setType(ApplicationCommandType.User),
	async execute(interaction, client) {
		//check channel
		if (await client.checkChannel(interaction, client) == false) { return }
        await interaction.reply({
            content: `${interaction.targetUser.displayAvatarURL()}`
        })
	},
}