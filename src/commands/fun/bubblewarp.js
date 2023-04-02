const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bubblewrap')
		.setDescription('pop pop pop!'),
        
	async execute(interaction, client) {
        bubble = '||pop||​' //uses a zero width space to make sure it line breaks at the correct point: >>​<<
        //20 = 2*2*5  12 = 3*2*2 //LCM = 2*2*3*5 = 60
        bubblewrap = bubble.repeat(60 * 3) //divisible by both 20 and 12 so it will make a whole thing on mobile or computer

        embed = new EmbedBuilder()
            .setTitle('Bubblewrap')
            .setDescription(`**${bubblewrap}**`)
            .setColor(client.colour)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
        
        //reply
        await interaction.reply({
            embeds: [embed]
        })
	}
}