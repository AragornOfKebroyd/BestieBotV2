const Guild = require('../../schemas/guild')
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
	Hello = result.Hello
	if (!Hello) return
	if (userMsg.content.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes('hello there')) {
		await userMsg.reply("General Kenobi")
	}
}