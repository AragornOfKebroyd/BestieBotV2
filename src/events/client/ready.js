const chalk = require('chalk')
const { ActionRow }  = require('discord.js')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		//once to  start
		client.pickPresence()
		//change presence randomly every 2 mins
		setInterval(client.pickPresence, 120 * 1000)
		
		//log
		console.log(chalk.green(`Ready! Logged in as ${client.user.tag}`))
	},
}