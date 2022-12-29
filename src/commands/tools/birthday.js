const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bday')
		.setDescription('help command')
        /* Add subcommand stopped it from working - work out later
        .addSubcommand(subcommand =>
            subcommand
                .setName('preferences')
                .setDescription('When do you want to get birthday reminders and who for.')
                .addStringOption(option =>
                    option.setName('category')
                        .setRequired(true)
                        .addChoices(
                            { name: 'People', value: 'peeps' },
                            { name: 'Frequency', value: 'rems' })))

        .addSubcommand(subcommand =>
            subcommand
                .setName('set')
                .setDescription('Set a birthday for a person'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('mute')
                .setDescription('e'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('unmute')
                .setDescription('f'))
        */
        ,
	async execute(interaction, client) {
        console.log(interaction)
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