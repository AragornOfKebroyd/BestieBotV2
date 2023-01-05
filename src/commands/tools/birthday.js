const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const mongoose = require('mongoose')
const Birthday = require('../../schemas/birthdays')
const Subscription = require('../../schemas/subscriptions')
const chalk = require('chalk')
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
                .setName('privacy')
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
            .setName('edit')
            .setDescription('Edit a birthday that you have added to the list.')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Who do you want to edit')
                .setAutocomplete(true)
                .setRequired(true))
            .addStringOption(option => option
                .setName('newname')
                .setDescription('Change the persons name'))
            .addIntegerOption(option => option
                .setName('newday')
                .setDescription('Change the day of their birthday')
                .setMinValue(1)
                .setMaxValue(31))
            .addStringOption(option => option
                .setName('month')
                .setDescription('Change the month of their birthday')
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
                .setName('newdiscordusername')
                .setDescription('Change the discord username associated with this person'))
            .addStringOption(option => option
                .setName('newprivacy')
                .setDescription('Change the privacy. Public: everyone can see, Private: Only you can see.')
                .addChoices(
                    { name: 'public', value: 'public' },
                    { name: 'private', value: 'private'})))
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete a birthday that you have added to the list or is under your username.')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Who do you want to delete')
                .setAutocomplete(true)
                .setRequired(true))),
    
    async autocomplete(interaction, client){
        const focusedValue = interaction.options.getFocused();
        choices = []
        users = await Birthday.find({}).select({ Name: 1, CreatedByDiscordId:1, Username:1, _id: 0 });
        if (interaction.options.getSubcommand() == 'delete'){
            for (user of users){
                choiseName = user.Name
                if (user.CreatedByDiscordId == interaction.user.id || user.Username == interaction.user.tag){
                    choices.push(`🟢 ${choiseName}`) //special space character used so it is removed later
                }
                else{
                    choices.push(`🔴 ${choiseName}`) //special space character used so it is removed later
                }
            }
        }else if (interaction.options.getSubcommand() == 'edit'){
            for (user of users){
                choiseName = user.Name
                if (user.CreatedByDiscordId == interaction.user.id){
                    choices.push(`🟢 ${choiseName}`) //special space character used so it is removed later
                }
                else {
                    choices.push(`🔴 ${choiseName}`) //special space character used so it is removed later
                }
            }
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
                const addname = interaction.options.getString('name').replace(/[^\x00-\x7F]/g,"")//get rid of non ascii;
                const day = interaction.options.getInteger('day');
                const month = interaction.options.getString('month');
                const username = interaction.options.getUser('discordusername') ?? 'None';
                const privacy = interaction.options.getString('privacy') ?? 'public';
                addBirthday(interaction, client, addname, day, month, username, privacy)
                break;
            case 'mute':
                //should be as simple as getting and then saving from the db
                break;
            case 'unmute':
                //should be as simple as getting and then saving from the db
                break;
            case 'delete':
                const deletename = interaction.options.getString('name').replace(/[^\x00-\x7F]/g,"");//get rid of circle and all other unicdoe
                deleteBirthday(interaction,client,deletename)
                break;
            case 'edit':
                const editname = interaction.options.getString('name').replace(/[^\x00-\x7F]/g,"");//get rid of circle and all other unicdoe
                const newname = interaction.options.getString('newname') ?? 'Dont Change';
                const newday = interaction.options.getInteger('newday') ?? 'Dont Change';
                const newmonth = interaction.options.getString('newmonth')?? 'Dont Change';
                const newusername = interaction.options.getUser('newdiscordusername') ?? 'Dont Change';
                const newprivacy = interaction.options.getString('newprivacy') ?? 'Dont Change';
                editBirthday(interaction, client, editname, newname, newday, newmonth, newusername, newprivacy)
                break;
            default:
                break;
        }
	},
    preferencesPeople,
    preferencesReminders,
    addBirthday,
    deleteBirthday,
    editBirthday
};

/*
so:
get all users from the birthdays database

*/
async function buildEmbedsandButtons(interaction, client){
    //calculate the number of pages needed
    result = await Birthday.find().select({ _id: 1, Name: 1, Date:1 })
    numOfPages = Math.ceil(result.length / 12)
    //get the reminders list of the person using the command
    subscriptionList = await Subscription.find({ DiscordID: interaction.user.id }).select({ RemindersArray : 1, _id : 0})
    reminders = subscriptionList[0].RemindersArray
    console.log(reminders)
    //array of pages
    embedarray = []
    buttonPages = []
    //itterate through all the pages
    for (i = 0; i < numOfPages; i++){
        //an embed for each page
        var currentembed = new EmbedBuilder()
            .setTitle(`Birthday Reminders ${i+1}/${numOfPages}`)
            .setDescription('Select who you do and dont want to be reminded about when it is near or on their birthday')
            .setColor(client.colour)
            .setThumbnail(`https://e7.pngegg.com/pngimages/199/741/png-clipart-party-popper-cartoon-illustration-party-popper-emoji-confetti-kids-bubble-fitness-app-holidays-text.png`)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
        var currentpage = []
        currentactionrow = new ActionRowBuilder()
        //itterate through people on each page
        for (j = 12*i; j < 12*i+12; j++){
            var person = result[j]
            //if it is more than there are
            if (j > result.length - 1){
                //push the current action row
                if (currentactionrow.components.length > 0){
                    currentpage.push(currentactionrow)
                }
                break
            }
            //add info for embeds
            currentembed.addFields({
                name: `${person.Name}`,
                value:`${person.Date}`,
                inline:true
            })

            //buttons, need to add seeing if they are in your subscription list, then doing success / danger depening on whether they are
            if (reminders.includes(person._id)){
                var currentbutton = new ButtonBuilder()
                    .setCustomId(`BIRTHDAY${person._id}`)
                    .setLabel(`${person.Name}`)
                    .setStyle(ButtonStyle.Success)
            } else {
                var currentbutton = new ButtonBuilder()
                    .setCustomId(`BIRTHDAY${person._id}`)
                    .setLabel(`${person.Name}`)
                    .setStyle(ButtonStyle.Danger)
            }
            
        
            currentactionrow.addComponents(currentbutton)
            //if the action row is full
            if (currentactionrow.components.length == 4){
                currentpage.push(currentactionrow)
                currentactionrow = new ActionRowBuilder()
            }
        }
        embedarray.push(currentembed)
        buttonPages.push(currentpage)
    }
    return [embedarray, buttonPages]
}

async function preferencesPeople(interaction, client){
    //first check if the user has a thing in the database
    result = await Subscription.find({ DiscordID:interaction.user.id })

    //if not create one for them
    if (result.length == 0){
        username = interaction.user.tag
        discordID = interaction.user.id
        newSubscription = await new Subscription({
            _id: mongoose.Types.ObjectId(),
            Username: username,
            DiscordID: discordID,
            RemindersArray: [],
            ThisMonthReminder: false,
            WeekBeforeReminder: false,
            DayBeforeReminder: true,
            OnDayReminder: false,
            Muted: false
        })
        //save
        await newSubscription.save().catch(console.error)
        
        console.log(chalk.blue(`[Database]: User: ${username} has been added to the subscriptions colleciton`))
    }
    

    //reply message creation
    [embedarray, buttonPages] = await buildEmbedsandButtons(interaction, client)
    var message = await interaction.reply({
        content:`Birthdays`,
        ephemeral: false,
        embeds: [embedarray[0]],
        components: buttonPages[0],
        fetchReply: true
    })

    //changes when you change page
    var currentPage = 0

    //react with emojis
    const emojis = ['◀️', '🛑', '▶️']
    for (emoji of emojis){
        message.react(emoji)
    }
    
    //filter and collected to get user input
    const filter = (reaction, user) => {
        return ['◀️', '🛑', '▶️'].includes(reaction.emoji.name) && user.id === interaction.user.id //whoever sent the command will only be able to return true from this function
    }

    const collector = message.createReactionCollector({ filter })

    //when reaction is clicked
    collector.on('collect', async (reaction, user) => {
        //remove the reaction
        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
        try {
            for (const reaction of userReactions.values()) {
                await reaction.users.remove(user.id);
            }
        } catch (error) {
            console.error('Failed to remove reactions.');
        }
        //do the code
        if (reaction.emoji.name == '◀️'){
            currentPage = await leftMenu(message, embedarray, currentPage)
        } else if (reaction.emoji.name == '▶️'){
            currentPage = await rightMenu(message, embedarray, currentPage)
        } else if (reaction.emoji.name == '🛑'){
            collector.stop('delete')
        }
    })

    collector.on('end', (collected, reason) => {
        if (reason && reason == 'delete'){
            message.delete()
        } else {
            message.reactions.removeAll()
        }        
    })
}

async function leftMenu(sentMessage, embedarray, currentPage){
    if (currentPage > 0){
        await sentMessage.edit({
            embeds: [embedarray[currentPage-1]],
            components: buttonPages[currentPage-1],
            fetchReply: true,
            ephemerel: true
        })
        currentPage = currentPage - 1
        return currentPage
    }
    return currentPage
}

async function rightMenu(sentMessage, embedarray, currentPage){
    if (currentPage < embedarray.length-1){
        await sentMessage.edit({
            embeds: [embedarray[currentPage+1]],
            components: buttonPages[currentPage+1],
            fetchReply: true,
            ephemerel: true
        })
        currentPage = currentPage + 1
        return currentPage
    }
    return currentPage
}



async function preferencesReminders(interaction, client){
    //embed with buttons
}

async function addBirthday(interaction, client, name, day, month, username, privacy){
    //check if anyone with the same name is allready in the colleciton
    result = await Birthday.find({ Name:name })
    if (result.length > 0){
        if (result[0].Username != 'None'){
            await interaction.reply({
                content: `The name ${name} Is allready in the database, their username is ${result[0].Username} and their birthday is stored as the ${result[0].Date}\nIf this is not who you are trying to add, sorry, add a second name or use a variation of the name.`
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
        Publicity: privacy,
        CreatedByDiscordId: interaction.user.id
    })

    //save
    await brithdayItem.save().catch(console.error)
    
    await interaction.reply({
        content: `**${name}** has now been added to the birthdays list.`,
        ephemerel: true
    })
    console.log(chalk.blue(`[Database]: Person: ${name} has been added to the birthdays colleciton`))
}

async function deleteBirthday(interaction, client, name){
    //get name
    result = await Birthday.find({ Name:name }).select({ Name: 1, CreatedByDiscordId:1, Username:1, _id: 0 })
    if (result.length == 0){
        await interaction.reply({
            content: `${name} was not in the reminders list, the search is very sensitive, try /birthday list to see who is in the birthday reminders list.`
        })
        return
    }
    //there should only be one result, but deletes the first result in any case
    deleteUser = result[0].Name
    CreatedById = result[0].CreatedByDiscordId
    Username = result[0].Username
    //If there is nobody in the database with that name
    if (!deleteUser){
        await interaction.reply({
            content: `${name} was not in the reminders list, the search is very sensitive, try /birthday list to see who is in the birthday reminders list.`
        })
        return;
    }
    //console.log(interaction.member.permissions.toArray())//testing
    //If you are admin (or me) you can bypass the check to see if you made the member
    if (CreatedById != interaction.user.id && !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers) && interaction.user.tag != Username){ //&& !message.user.id == '619826088788623361'
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

async function editBirthday(interaction, client, name, newname, newday, newmonth, newusername, newprivacy){
    //check if a user exists
    result = await Birthday.find({ Name : name })
    if (result.length == 0){
        await interaction.reply({
            content: `${name} was not in the reminders list, the search is very sensitive, try /birthday list to see who is in the birthday reminders list.`
        })
        return
    }
    if (newname == 'Dont Change' && newusername == 'Dont Change' && newday == 'Dont Change' && newmonth == 'Dont Change' && newprivacy == 'Dont Change'){
        await interaction.reply({
            content: `there is inputed nothing to change`
        })
        return
    }
    //new name
    if (newname == 'Dont Change') newname = result[0].Name

    //new Username
    if (newusername == 'Dont Change') newusername = result[0].Username
    
    //calculate new date
    if (newday == 'Dont Change') newday = result[0].Date.split('/')[0]
    if (newmonth == 'Dont Change') newmonth = result[0].Date.split('/')[1]
    newdate = `${newday}/${newmonth}`

    //newprivacy
    if (newprivacy == 'Dont Change') newprivacy = result[0].Publicity

    //replace
    try {
        Birthday.findOneAndUpdate({ Name : name }, { Username : newusername, Name: newname, Date: newdate, Publicity: newprivacy }, function(err,res){
            if (err) return console.error(err)
            return
        })
        console.log(chalk.blue(`[Database]: ${name} Updated in birthday collection.`))
        await interaction.reply({
            content: `Succesfully updated ${name} in the birthday reminder list, new details:\nName: ${newname}\nBirthday: ${newdate}\nPrivacy: ${newprivacy}\nUsername: ${newusername}`
        })
    } catch (error) {
        console.log(chalk.red(`[Database]: ${name} Failed to update in birthday collection.`))
        await interaction.reply({
            content: `something went wrong when trying to update ${name}`
        })
    }   
}