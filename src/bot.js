const fs = require('node:fs')
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const { token, testingtoken, oldtoken, mongoDBtoken, clientId, clientIdTest, clientIdOld, OwnerId } = require('../config.json')
const mongoose = require("mongoose")
const { connect } = require('mongoose')
mongoose.set('strictQuery', false)

//setup on where to post to and stuff
if (process.argv.length > 2){
	config = process.argv.slice(2)
	if (config == 'testServer'){ //npm run test
		where = 'testing'
		login = testingtoken
		id = clientIdTest
	} else if (config == 'allServers'){ //npm run all
		where = 'everywhere'
		login = testingtoken
		id = clientIdTest
	} else if (config == 'production'){ //npm run prod
		where = 'everywhere'
		login = token
		id = clientId
	} else if (config == 'oldbot'){ //npm run old
		where = 'everywhere'
		login = oldtoken
		id = clientIdOld
	}
} else { //node .
	where = 'testing'
	login = testingtoken
	id = clientIdTest
}

//requirements for what the bot can access, its intents
const { Guilds, GuildMessages, GuildMessageReactions, DirectMessages, MessageContent,  } = GatewayIntentBits
const client = new Client({ intents: [
	Guilds, 
	DirectMessages, 
	GuildMessageReactions, 
	GuildMessages, 
	MessageContent
]})

//.commands can be accesed from any script
client.commands = new Collection()
client.commandArray = []

//components
client.buttons = new Collection()
client.selectMenus = new Collection()
client.modals = new Collection()

//colours to reference in embeds
client.colour = 8078069 // 0x7b42f5
client.green = 4033600 // 0x3d8c40
client.red = 12127754 // 0xb90e0a

//me
client.Aragorn = OwnerId

//functions
const functionsFolders = fs.readdirSync("./src/functions")
for (const folder of functionsFolders){
	const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter(file => file.endsWith('.js'))
	for (const file of functionFiles){
		require(`./functions/${folder}/${file}`)(client)
	}
}

//run handlers
client.handleCommands(login, id, where)
client.handleEvents()
client.handleCronjobs()
client.handleComponents()

//login to discord bot
client.login(login); //needed semi colon

//connect to MongoDB database
(async () => {
	await connect(mongoDBtoken).catch(console.error)
})()