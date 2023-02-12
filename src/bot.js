const fs = require('node:fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, testingtoken, mongoDBtoken } = require('../config.json');
const mongoose = require("mongoose"); const { connect } = require('mongoose')
mongoose.set('strictQuery', false);

//requirements for what the bot can access, its intents
const { Guilds, GuildMessages, GuildMessageReactions, DirectMessages, MessageContent,  } = GatewayIntentBits
const client = new Client({ intents: [
	Guilds, 
	DirectMessages, 
	GuildMessageReactions, 
	GuildMessages, 
	MessageContent
]});

//.commands can be accesed from any script
client.commands = new Collection();
client.commandArray = [];

//components
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();

//colours to reference in embeds
client.colour = "0x7b42f5";
client.green = "0x3d8c40";
client.red = "0xb90e0a";

//me
client.Aragorn = '619826088788623361'

//functions
const functionsFolders = fs.readdirSync("./src/functions")
for (const folder of functionsFolders){
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of functionFiles){
		require(`./functions/${folder}/${file}`)(client)
	}
}

//run handlers
client.handleCommands();
client.handleEvents();
client.handleCronjobs();
client.handleComponents();

//login to discord bot
client.login(token);

//connect to MongoDB database
(async () => {
	await connect(mongoDBtoken).catch(console.error)
})();