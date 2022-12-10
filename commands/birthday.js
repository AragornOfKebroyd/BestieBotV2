const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bday')
		.setDescription('help command')

        .addSubcommand(subcommand =>
            subcommand
                .setName('preferences')
                .setDescription('When do you want to get birthday reminders and who for')
                .addStringOption(option =>
                    option.setName('category')
                        .setDescription('choice')
                        .setRequired(true)
                        .addChoices(
                            { name: 'People', value: 'peeps' },
                            { name: 'Remeinders', value: 'rems' })))

        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('d'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('mute')
                .setDescription('e'))

        .addSubcommand(subcommand =>
            subcommand
                .setName('unmute')
                .setDescription('f'))
    
                ,
	async execute(interaction) {
        console.log(interaction)
		await interaction.reply('go away nerd');
	},
};