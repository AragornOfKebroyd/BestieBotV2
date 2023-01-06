const { InteractionType } = require('discord.js')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction, client) {
		//commands
		if (interaction.type == InteractionType.ApplicationCommand){
			//get command
			const { commands } = client
			const { commandName } = interaction
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
			
			//special case for birthday as there are as many ids as there are people in the bdays db
			if (customId.includes('BIRTHDAY')){
				const brokenDown = customId.split(':')
				var button = buttons.get(brokenDown[2])
				try {
					await button.execute(interaction, client, customId);
				}//if it errors
				catch (error) {
					console.error(error)
				}
				return
			}

			var button = buttons.get(customId)

			if (!button) return new Error("there is no code for this button")

			//run the button code
			try {
				await button.execute(interaction, client);
			}//if it errors
			catch (error) {
				console.error(error)
			}
		}//menu
		else if (interaction.isStringSelectMenu()){
			const { selectMenus } = client;
			const { customId } = interaction;
			const menu = selectMenus.get(customId);

			if (!menu) return new Error("there is no code for this select menu")

			//run the menu code
			try {
				await menu.execute(interaction, client);
			}//if it errors
			catch (error) {
				console.error(error)
			}
		}//modals (little popup boxes to fill in text)
		else if (interaction.type == InteractionType.ModalSubmit){
			const { modals } = client
			const { customId } = interaction;
			const modal = modals.get(customId);

			if (!modal) return new Error("there is no code for this select modal")
			
			//run the modal code
			try {
				await modal.execute(interaction, client);
			}//if it errors
			catch (error) {
				console.error(error)
			}
		}//context menu apps
		else if (interaction.isContextMenuCommand()){
			const { commands } = client
			const { customId } = interaction;
			const contextCommand = commands.get(customId);

			if (!contextCommand) return new Error("there is no code for this context command")
			
			//run the command code
			try {
				await contextCommand.execute(interaction, client);
			}//if it errors
			catch (error) {
				console.error(error)
			}
		}//autocomplete commands
		else if (interaction.type == InteractionType.ApplicationCommandAutocomplete){
			const { commands } = client
			const { commandName } = interaction
			const command = commands.get(commandName);
			
			//if no command
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			//try to execute the command
			try {
				await command.autocomplete(interaction, client)
			}//if it errors
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