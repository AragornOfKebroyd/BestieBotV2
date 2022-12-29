const { SlashCommandBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('menu')
		.setDescription('choose your favourite number (1-5)!'),
	async execute(interaction, client) {
        const menu = new SelectMenuBuilder()
            .setCustomId('')
	},
};