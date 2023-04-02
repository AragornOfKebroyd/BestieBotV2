const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rolldice')
		.setDescription('Roll a Dice!')
        .addIntegerOption(option => option
            .setName('sides')
            .setDescription('Number of sides on your dice')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(1000000000)),

	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		embed = new EmbedBuilder()
            .setTitle(`Rolling a d${interaction.options.getInteger('sides')}`)
            .setColor(client.colour)
            .setImage('https://i.pinimg.com/originals/0f/ba/e2/0fbae2bd3a0bd45b0d6a25f6459d95a3.gif')
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
        //random between 1 and number of sides
        number = Math.floor(Math.random() * (interaction.options.getInteger('sides'))) + 1
        percentage = number / interaction.options.getInteger('sides')
        await wait(1500)
        await interaction.editReply({
            embeds: [embed
                .setImage('https://i.imgur.com/XxBU2.jpg?1')
                .setTitle(`Rolled a ${interaction.options.getInteger('sides')} sided dice and got ${number}`)]
        })
	},
}