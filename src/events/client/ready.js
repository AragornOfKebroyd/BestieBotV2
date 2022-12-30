const chalk = require('chalk');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(chalk.green(`Ready! Logged in as ${client.user.tag}`));
	},
};