const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

//functions that can be called from other scripts
module.exports = {DirectMessage}


//requirements for what the bot can access, its intents
const client = new Client({ intents: [
	GatewayIntentBits.Guilds, 
	GatewayIntentBits.DirectMessages, 
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
]});

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
		//event.name is the name of the event stored in each file, and event.execute is the function within the event files
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		//For multiple events on, for single events once (like ready)
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//cron jobs
const cronJobPath = path.join(__dirname, 'cronjobs');
const cronJobFiles = fs.readdirSync(cronJobPath).filter(file => file.endsWith('.js'));

//Starts all cron jobs
for (const file of cronJobFiles) {
	const filePath = path.join(cronJobPath, file);
	const cronJob = require(filePath);
	//run initialise function of all cron jobs
	cronJob.cronInit()
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

//called from outside scripts
function DirectMessage(id,message) {
	//not sure why i need to login again but it works lmao
	client.login(token)
	//send message to the user
	client.users.fetch(id, false).then((user) => {
		user.send(message)
	})
}


client.login(token)