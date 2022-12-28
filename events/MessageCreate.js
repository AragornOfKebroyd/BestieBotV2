const { Events } = require('discord.js');

module.exports = {
	name: Events.messageCreate,
	execute(message) {
		main(message)
	},
};


function main(){
	console.log(`message sent ${message.content}`);
}

