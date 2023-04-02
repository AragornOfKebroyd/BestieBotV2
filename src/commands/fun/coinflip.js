const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('Flip a Coin!'),
        
	async execute(interaction, client) {
		embed = new EmbedBuilder()
            .setTitle('Fliping coin....')
            .setColor(client.colour)
            .setImage('https://media.tenor.com/tewn7lzVDgcAAAAC/coin-flip-flip.gif')
            .setTimestamp(Date.now())
            .setAuthor({
                iconURL: interaction.user.displayAvatarURL(),
                name: interaction.user.tag
            })
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })

        await interaction.reply({
            embeds: [embed],
            fetchReply: true
        })
        //random between 0 and 1
        headortail = Math.floor(Math.random() * 2)

        if (headortail == 0){//heads
            await wait(1500)
            await interaction.editReply({
                embeds: [embed
                    .setImage('https://i1.sndcdn.com/avatars-000597831615-6q438f-t500x500.jpg')
                    .setTitle('Heads!')]
            })
        }else{//tails
            await wait(1000)
            await interaction.editReply({
                embeds: [embed
                    .setImage('https://upload.wikimedia.org/wikipedia/en/1/1a/Miles_%22Tails%22_Prower_Sonic_and_All-Stars_Racing_Transformed.png')
                    .setTitle('Tails!')]
            })
        }
	},
}