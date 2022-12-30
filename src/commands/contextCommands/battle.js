const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('battle (Not Done)')
		.setType(ApplicationCommandType.User),
	async execute(interaction, client) {
        await interaction.reply({
            content: `this functionality has not been made yet.`,
            ephemeral: true
        })
	},
};