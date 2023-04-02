const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Returns an embed'),
        
	async execute(interaction, client) {
		const embed = new EmbedBuilder()
            .setTitle('This is an embed')
            .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            .setDescription('Description')
            .setColor(client.colour)
            .setImage(client.user.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setAuthor({
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
            .addFields([
                {
                    name: 'field 1',
                    value: 'field value 1',
                    inline: true
                },
                {
                    name: 'field 2',
                    value: 'field value 2',
                    inline: true
                }
            ])
        await interaction.reply({
            embeds: [embed]
        })
	},
}