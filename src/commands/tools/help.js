const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
//toDo
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help command'),
		
	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		
		const embed = new EmbedBuilder()
            .setTitle('Xx Bestie Bot V2')
            .setURL('https://github.com/AragornOfKebroyd/BestieBotV2')
            .setDescription('This is an overview of all commands of Xx Besite Bot V2')
            .setColor(client.colour)
            .setImage(client.user.displayAvatarURL())
            //.setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setAuthor({
                iconURL: client.user.displayAvatarURL(),
                name: client.user.tag
            })
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
            .addFields([
                {
                    name: 'battle (context)',
                    value: 'field value 1',
                    inline: true
                },
                {
                    name: 'l',
                    value: 'l constant',
                    inline: true
                }
            ])
	},
}