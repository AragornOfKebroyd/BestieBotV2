const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

//requirements for what the bot can access, its intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//.commands can be accesed from any script
client.commands = new Collection();
//commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

//add commands to list
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	  const command = require(filePath);
	  client.commands.set(command.data.name, command);
  }

//events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

//starts all event listeners
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//on interaction with bot
client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
  
	const command = client.commands.get(interaction.commandName);

	if (!command) return;
  
  //use command code from commands folder on interaction
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);