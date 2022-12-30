const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birthday')
		.setDescription('For Birthday reminders')
        .addSubcommand(subcommand => subcommand
            .setName('preferences')
            .setDescription('When do you want to get birthday reminders and who for.')
            .addStringOption(option => option
                .setName('category')
                .setDescription('I hate you')
                .setRequired(true)
                .addChoices(
                    { name: 'People', value: 'people' },
                    { name: 'Frequency', value: 'reminders' })))
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add a persons birthday. Public: everyone can see and subscribe to, Private: Only you can see'))
            .addChoices(
                { name: 'public', value: 'public' },
                { name: 'private', value: 'private'})
        .addSubcommand(subcommand => subcommand
            .setName('mute')
            .setDescription('Mute birthday reminders from the bot (turn back on with /unmute).'))
        .addSubcommand(subcommand => subcommand
            .setName('unmute')
            .setDescription('Turn reminders back on.')),
    
	async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case 'preferences':
                //category is people or reminders
                const category = interaction.options.getString('category');
                if (category == 'people') {

                }else {//reminders

                }
                break;
            case 'add':
                
                break;
            case 'mute':
                
                break;
            case 'unmute':
                
                break;
            default:
                break;
        }

        /*
        const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('primary')
					.setLabel('Click me!')
					.setStyle(ButtonStyle.Primary),
			);
        await interaction.reply({ content: 'I think you should,', components: [row] });
        */
	},
    preferencesPeople,
    preferencesReminders,
    addBirthday
};


async function preferencesPeople(){
    //embed with buttons
}

async function preferencesReminders(){
    //embed with buttons
}

async function addBirthday(){
    //modal
}