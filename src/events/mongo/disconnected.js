const chalk = require('chalk');

module.exports = {
	name: 'disconnected',
	execute() {
		console.log(chalk.orange("[Database]: Disconnected"))
	},
};
