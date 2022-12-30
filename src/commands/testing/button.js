const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('button')
		.setDescription('Make a magical button appear'),
        
	async execute(interaction, client) {
        const button = new ButtonBuilder()
            .setCustomId('githubLink')
            .setLabel('Magic! woooh')
            .setStyle(ButtonStyle.Primary)

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(button)]
        });
	},
};