const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reactor')
		.setDescription('You can click on some thingys'),
	async execute(interaction, client) {
        const message = await interaction.reply({
            content: 'React to this! no way:',
            fetchReply: true
        })
        //reply with all the emojis
        const emojis = ['🪄', '👍', '🐠', '🐫', '🏓']
        for (emoji of emojis){
            message.react(emoji)
        }

        const filter = (reaction, user) => {
            return reaction.emoji.name == '🐫' && user.id == interaction.user.id //whoever sent the command will only be able to return true from this function
        }

        const collector = message.createReactionCollector({ filter, time: 60000 })

        collector.on('collect', (reaction, user) => {
            //console.log(`Collected ${reaction.emoji.name} from ${user.tag}`)
        })

        collector.on('end', collected => {
            //console.log(`Collected ${collected.size} items`)
        })
	},
};