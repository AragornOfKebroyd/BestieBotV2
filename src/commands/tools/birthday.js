const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bday')
		.setDescription('help command')
        .addSubcommand(subcommand =>
            subcommand
                .setName('preferences')
                .setDescription('When do you want to get birthday reminders and who for.')
                .addStringOption(option =>
                    option
                        .setName('category')
                        .setDescription('I hate you')
                        .setRequired(true)
                        .addChoices(
                            { name: 'People', value: 'peeps' },
                            { name: 'Frequency', value: 'rems' }
                        )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('I hate you'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('mute')
                .setDescription('I hate you'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('unmute')
                .setDescription('I hate you'))
        ,
	async execute(interaction, client) {
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Click me!')
					.setStyle(ButtonStyle.Primary),
			);
        await interaction.reply({ content: 'I think you should,', components: [row] });
	},
};