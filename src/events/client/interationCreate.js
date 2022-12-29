module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		if (interaction.isChatInputCommand()){
			//get command
			const { commands } = client
			const { commandName } = interaction
			console.log(commandName)
			const command = commands.get(commandName);
			
			//if no command
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction, client);
			} 
			catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
				await interaction.reply({
					content: "Something went wrong while executing this command...",
					ephemeral: true
				})
			}
		}
	},
};