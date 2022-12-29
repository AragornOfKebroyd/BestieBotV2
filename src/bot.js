const fs = require('node:fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, testingtoken, mongoDBtoken } = require('../config.json');

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
client.commandArray = []

//functions
const functionsFolders = fs.readdirSync("./src/functions")
for (const folder of functionsFolders){
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of functionFiles){
		require(`./functions/${folder}/${file}`)(client)
	}
}

//called from outside scripts
function DirectMessage(id,message) {
	//not sure why i need to login again but it works lmao
	client.login(token)
	//send message to the user
	client.users.fetch(id, false).then((user) => {
		user.send(message)
	})
}

//run handlers
client.handleCommands();
client.handleEvents();
client.handleCronjobs();

//login to discord bot
client.login(token);

//connect to MongoDB database
/*
(async () => {
	await connect(mongoDBtoken).catch(console.error)
})();
*/