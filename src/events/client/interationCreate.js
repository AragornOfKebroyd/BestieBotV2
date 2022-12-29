module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		//commands
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
			//try to execute the command
			try {
				await command.execute(interaction, client);
			}//if it errors
			catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
				await interaction.reply({
					content: "Something went wrong while executing this command...",
					ephemeral: true
				})
			}
		}//buttons
		else if (interaction.isButton()) {

			//get the button of the interactionId of the button
			const { buttons } = client
			const { customId } = interaction
			const button = buttons.get(customId)

			if (!button) return new Error("there is no code for this button")

			//run the buttonId button code
			try {
				await button.execute(interaction, client);
			}//if it errors
			catch (error) {
				console.error(error)
			}
		}
	},
};