const chalk = require('chalk');

module.exports = {
	name: 'error',
	execute(error) {
		console.log(chalk.red(`[Database]: An error has occured with the database connection:\n${error}`))
	},
};
