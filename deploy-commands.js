//Only run manually to update commands to the bot
const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');

//make a list of commands to register with discord slash commands
const commands = [];
//path of commands dir
const commandsPath = path.join(__dirname, 'commands');
//only register js files
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//add commands to list
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

//allows for script to be run once
const rest = new REST({ version: '10' }).setToken(token);

//Registers all commands in commands list
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);