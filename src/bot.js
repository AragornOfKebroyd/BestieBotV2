const fs = require('node:fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { token, testingtoken, oldtoken, mongoDBtoken } = require('../config.json');
const mongoose = require("mongoose"); const { connect } = require('mongoose')
mongoose.set('strictQuery', false);

//setup on where to post to and stuff
if (process.argv.length > 2){
	config = process.argv.slice(2)
	if (config == 'allServers'){
		where = 'everywhere'
		login = testingtoken
	} else if (config == 'testServer'){
		where = 'testing'
		login = testingtoken
	} else if (config == 'production'){
		where = 'everywhere'
		login = token
	} else if (config == 'oldbot'){
		where = 'everywhere'
		login = oldtoken
	}
} else {
	login = testingtoken
	where = 'testing'
}
console.log(login, where)

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
client.handleCommands(where);
client.handleEvents();
client.handleCronjobs();
client.handleComponents();

//login to discord bot
client.login(login);

//connect to MongoDB database
(async () => {
	await connect(mongoDBtoken).catch(console.error)
})();