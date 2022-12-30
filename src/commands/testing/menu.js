const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const testMenu = require('../../components/selectMenus/testMenu');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('menu')
		.setDescription('choose your favourite number (1-5)!'),
        
	async execute(interaction, client) {
        const menu = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder()
            .setCustomId('testMenu')
            .setPlaceholder('Favourite Number?')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: '4',
                    description: 'woah',
                    value: '4'
                },
                {
                    label: '1',
                    description: 'kerblam',
                    value: '1'
                },
                {
                    label: '2',
                    description: 'sploosh',
                    value: '2'
                },
                {
                    label: '5',
                    description: 'le gasp',
                    value: '5'
                },
                {
                    label: '3',
                    description: 'gonng',
                    value: '3'
                }
            ])
        )
        await interaction.reply({
            content: 'Menu:',
            components: [menu]
        })
	},
};