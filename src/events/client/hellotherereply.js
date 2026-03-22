const Guild = require('../../schemas/guild')
const chalk = require('chalk')
const mongoose = require('mongoose')

module.exports = {
	name: 'messageCreate',
	execute(message) {
		//return if message is by a bot
		if (message.author.bot == true) return

		//main procedure
		main(message)
	},
}

async function main(userMsg){
	//check guild settins in database, if false return
	result = await Guild.findOne({ guildId: userMsg.channel.guild.id}).select({ Hello: 1, _id: 0})
	if (!result) {
		guildProfile = await new Guild({
			_id: mongoose.Types.ObjectId(),
			guildId: userMsg.channel.guild.id,
			guildName: userMsg.channel.guild.name,
			guildIcon: userMsg.channel.guild.iconURL() ? userMsg.channel.guild.iconURL() : "None",
			Xs: false,
			Hello: false,
			ChannelID: "0",
		})
		
		await guildProfile.save().catch(console.error)
		
		//send message to server
		console.log(chalk.blue(`[Database]: Server: '${userMsg.channel.guild.name}' Added to guild DB.`))
		result = { Hello: false }
	}
	Hello = result.Hello
	if (!Hello) return
	if (userMsg.content.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes('hello there')) {
		await userMsg.reply("General Kenobi")
	}
}