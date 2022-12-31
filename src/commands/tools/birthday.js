const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const mongoose = require('mongoose')
const Birthday = require('../../schemas/birthdays')

//publicity not accounted for yet, needs to be able to have one of the same name in public and in private - todo

module.exports = {
	data: new SlashCommandBuilder()
		.setName('birthday')
		.setDescription('For Birthday reminders')
        .addSubcommand(subcommand => subcommand
            .setName('preferences')
            .setDescription('When do you want to get birthday reminders and who for.')
            .addStringOption(option => option
                .setName('category')
                .setDescription('People: which birthdays do you want to be reminded about, Frequency: How Often')
                .setRequired(true)
                .addChoices(
                    { name: 'People', value: 'people' },
                    { name: 'Frequency', value: 'reminders' })))
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add a persons birthday.')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Persons name')
                .setRequired(true))
            .addIntegerOption(option => option
                .setName('day')
                .setDescription('Date Of Birth: Day')
                .setMinValue(1)
                .setMaxValue(31)
                .setRequired(true))
            .addStringOption(option => option
                .setName('month')
                .setDescription('Date Of Birth: Month')
                .setRequired(true)
                .addChoices(
                    { name: 'January', value: '1' },
                    { name: 'Febuary', value: '2' },
                    { name: 'March', value: '3' },
                    { name: 'April', value: '4' },
                    { name: 'May', value: '5' },
                    { name: 'June', value: '6' },
                    { name: 'July', value: '7' },
                    { name: 'August', value: '8' },
                    { name: 'September', value: '9' },
                    { name: 'October', value: '10' },
                    { name: 'November', value: '11' },
                    { name: 'December', value: '12' }))
            .addUserOption(option => option
                .setName('discordusername')
                .setDescription('User of persons birthday(Not Required If Not Applicable)'))
            .addStringOption(option => option
                .setName('privicy')
                .setDescription('Public: everyone can see and subscribe to, Private: Only you can see (default: Public)')
                .addChoices(
                    { name: 'public', value: 'public' },
                    { name: 'private', value: 'private'})))
        .addSubcommand(subcommand => subcommand
            .setName('mute')
            .setDescription('Mute birthday reminders from the bot (turn back on with /unmute).'))
        .addSubcommand(subcommand => subcommand
            .setName('unmute')
            .setDescription('Turn reminders back on.'))
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete a birthday that you have added to the list.')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Who do you want to delete')
                .setAutocomplete(true)
                .setRequired(true))),
    
    async autocomplete(interaction, client){
        const focusedValue = interaction.options.getFocused();
        choices = []
        users = await Birthday.find({}).select({ Name: 1, _id: 0 });
        for (user of users){
            choices.push(user.Name)
        }
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },

	async execute(interaction, client) {
        switch (interaction.options.getSubcommand()) {
            case 'preferences':
                //category is people or reminders
                const category = interaction.options.getString('category');
                if (category == 'people') {
                    preferencesPeople(interaction, client)
                }else {//reminders
                    preferencesReminders(interaction, client)
                }
                break;
            case 'add':
                //get input values
                const addname = interaction.options.getString('name');
                const day = interaction.options.getInteger('day');
                const month = interaction.options.getString('month');
                const username = interaction.options.getUser('discordusername') ?? 'None';
                const privicy = interaction.options.getString('privicy') ?? 'public';
                addBirthday(interaction, client, addname, day, month, username, privicy)
                break;
            case 'mute':
                //should be as simple as getting and then saving from the db
                break;
            case 'unmute':
                //should be as simple as getting and then saving from the db
                break;
            case 'delete':
                const deletename = interaction.options.getString('name');
                deleteBirthday(interaction,client,deletename)
                break;
            default:
                break;
        }
	},
    preferencesPeople,
    preferencesReminders,
    addBirthday,
    deleteBirthday
};

/*
so:
get all users from the birthdays database

*/


async function preferencesPeople(interaction, client){
    //making things
    const embed = new EmbedBuilder()
        .setTitle('Birthday Reminders')
        .setDescription('Select who you do and dont want to be reminded about when it is near or on their birthday')
        .setColor(client.colour)
        .setThumbnail(`https://e7.pngegg.com/pngimages/199/741/png-clipart-party-popper-cartoon-illustration-party-popper-emoji-confetti-kids-bubble-fitness-app-holidays-text.png`)
        .setTimestamp(Date.now())
        .setFooter({
            iconURL: client.user.displayAvatarURL(),
            text: client.user.tag,
        })
        .addFields([
            {
                name: 'field 1',
                value: 'field value 1'
            },
            {
                name: 'field 2',
                value: 'field value 2'
            }
        ]);
    
    //reply
    await interaction.reply({
        embeds: [embed]
    })
}

async function preferencesReminders(interaction, client){
    //embed with buttons
}

async function addBirthday(interaction, client, name, day, month, username, privicy){
    //check if anyone with the same name is allready in the colleciton
    result = await Birthday.find({ Name:name })
    console.log(result)
    if (result != [{}]){
        if (result[0].Username != 'None'){
            await interaction.reply({
                content: `The name ${name} Is allready in the database, they are ${result[0].Username} and their birthday is stored as ${result[0].Date}\nIf this is not who you are trying to add, sorry, add a second name or use a variation of the name.`
            })   
        }else{
            await interaction.reply({
                content: `The name ${name} Is allready in the database, their birthday is stored as ${result[0].Date}.\nIf this is not who you are trying to add, sorry, add a second name or use a variation of the name.`
            })
        }
        return;
    }

    //make a date, day is a number 1 to 31, month is a number 1 to 12
    date = `${day}/${month}`

    //make new birthday item to add to colleciton
    brithdayItem = await new Birthday({
        _id: mongoose.Types.ObjectId(),
        Username: username,
        Name: name,
        Date: date,
        Publicity: privicy,
        CreatedByDiscordId: interaction.user.id
    })

    //save
    await brithdayItem.save().catch(console.error)
    
    await interaction.reply({
        content: `**${name}** has now been added to the birthdays list.`,
        ephemerel: true
    })
    console.log(chalk.blue(`[Database]: Server: '${interaction.guild.name}' Added to guild DB.`))
}

async function deleteBirthday(interaction, client, name){
    result = await Birthday.find({ Name:name }).select({ Name: 1, CreatedByDiscordId:1, _id: 0 })
    //there should only be one result, but deletes the first result in any case
    deleteUser = result[0].Name
    CreatedById = result[0].CreatedByDiscordId

    //If there is nobody in the database with that name
    if (!deleteUser){
        await interaction.reply({
            content: `${name} was not in the reminders list, the search is very sensitive, try /birthday preferences to see who is in the birthday reminders list.`
        })
        return;
    }

    //If you are admin (or me) you can bypass the check to see if you made the member
    if (CreatedById != interaction.user.id && (!interaction.member.hasPermission("ADMINISTRATOR") || message.user.id == '619826088788623361')){
        await interaction.reply({
            content: `You cannot delete ${name} as you did not add them, you can ask an admin.`
        })
        return;
    }
    //try catch loop for deleting user from the reminders list
    try {
        await Birthday.deleteOne({ Name: name })
        await interaction.reply({
            content: `${name} was removed from the birthday reminders list.`
        })
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: `There was an error deleting ${name} from the database.`
        })
    }
    
}