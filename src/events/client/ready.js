const chalk = require('chalk');
const { ActivityType, ActionRow }  = require('discord.js')

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		//log
		console.log(chalk.green(`Ready! Logged in as ${client.user.tag}`));

		//ActivityType.Watching, ActivityType.Listening, ActivityType.Playing, ActivityType.Competing, ActivityType.Streaming, ActivityType.Custom
		const presenceOptions = [
			{
				type:ActivityType.Listening,
				text: 'to lofi blip bot beats',
				status: 'online'
			},
			{
				type:ActivityType.Playing,
				text: '10D minesweeper',
				status: 'online'
			},
			{
				type:ActivityType.Competing,
				text: 'to be the best bot there ever was',
				status: 'online'
			},
			{
				type:ActivityType.Watching,
				text: '30 Discord.JS tutorials simultaniously',
				status: 'online'
			},
			{
				type:ActivityType.Custom,
				text: '0x45',
				status: 'online'
			}
		]
	},
};