const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')
const mongoose = require('mongoose')
const Birthday = require('../../schemas/birthdays')
const Subscription = require('../../schemas/subscriptions')
const chalk = require('chalk')

//Needs a good look through and refactor for new only see what you have made feature

module.exports = {
    data: new SlashCommandBuilder()
        .setName('birthday')
        .setDescription('For Birthday reminders, do /help for privacy policy')
        .addSubcommand(subcommand => subcommand
            .setName('preferences')
            .setDescription('When do you want to get birthday reminders and who for. /help for privacy policy')
            .addStringOption(option => option
                .setName('category')
                .setDescription('People: which birthdays do you want to be reminded about, Frequency: How Often')
                .setRequired(true)
                .addChoices(
                    { name: 'People', value: 'people' },
                    { name: 'Frequency', value: 'reminders' })))
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add a persons birthday. /help for privacy policy')
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
                    { name: 'December', value: '12' })))
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
                .setName('newmonth')
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
                    { name: 'December', value: '12' })))
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete a birthday from your reminders.')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Who do you want to delete')
                .setAutocomplete(true)
                .setRequired(true)))
        .addSubcommand(subcommand => subcommand
            .setName('next')
            .setDescription('Show the next few birthdays.')
            .addIntegerOption(option => option
                .setName('number')
                .setDescription('How many birthdays do you want to see (default : 5)')
                .setMinValue(1)
                .setMaxValue(10))
            .addStringOption(option => option
                .setName('type')
                .setDescription('All or just those you have reminders for')
                .addChoices(
                    { name: 'All', value: 'all' },
                    { name: 'Subscribed', value: 'subscribed' })))
        .addSubcommand(subcommand => subcommand
            .setName('export')
            .setDescription('export selected birthdays into a format that can be imported by other people'))
        .addSubcommand(subcommand => subcommand
            .setName('import')
            .setDescription('import birthdays from exported text format')),

    async autocomplete(interaction, client) {
        const focusedValue = interaction.options.getFocused()
        choices = []
        users = await Birthday.find({ CreatedByDiscordId: interaction.user.id }).select({ Name: 1, CreatedByDiscordId: 1, _id: 0 })

        if (interaction.options.getSubcommand() == 'delete') {
            for (user of users) {
                choiseName = user.Name
                if (user.CreatedByDiscordId == interaction.user.id) {
                    choices.push(`🟢 ${choiseName}`) //special space character used so it is removed later
                }
                else {
                    choices.push(`🔴 ${choiseName}`) //special space character used so it is removed later
                }
            }
        } else if (interaction.options.getSubcommand() == 'edit') {
            for (user of users) {
                choiseName = user.Name
                if (user.CreatedByDiscordId == interaction.user.id) {
                    choices.push(`🟢 ${choiseName}`) //special space character used so it is removed later
                }
                else {
                    choices.push(`🔴 ${choiseName}`) //special space character used so it is removed later
                }
            }
        }

        const filtered = choices.filter(choice => choice.replace(/[^\x00-\x7F]/g, "").toLowerCase().startsWith(focusedValue.toLowerCase()))
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })).slice(0, 25),
        )
    },

    async execute(interaction, client) {
        //check channel
        if (await client.checkChannel(interaction, client) == false) { return }
        checkAndCreateSubProfileIfNotHasOne(interaction)
        switch (interaction.options.getSubcommand()) {
            case 'preferences':
                //category is people or reminders
                const category = interaction.options.getString('category')
                if (category == 'people') {
                    preferencesPeople(interaction, client)
                } else {//reminders
                    preferencesReminders(interaction, client)
                }
                break
            case 'add':
                //get input values
                const addname = interaction.options.getString('name').replace(/[^\x00-\x7F]/g, "")//get rid of non ascii
                const day = interaction.options.getInteger('day')
                const month = interaction.options.getString('month')
                addBirthday(interaction, client, addname, day, month)
                break
            case 'mute':
                //get muted attribute
                result = await Subscription.find({ DiscordID: interaction.user.id }).select({ Muted: 1, _id: 0 })
                isMuted = result[0].Muted
                if (isMuted == true) {
                    await interaction.reply({
                        content: `Birthday reminders are allready muted.`,
                        ephemeral: true
                    })
                } else {
                    //update db
                    Subscription.findOneAndUpdate({ DiscordID: interaction.user.id }, { Muted: true }, function (err, res) {
                        if (err) return console.error(err)
                    })
                    await interaction.reply({
                        content: `Birthday reminders muted.`,
                        ephemeral: true
                    })
                }
                break
            case 'unmute':
                //get muted attribute
                result = await Subscription.find({ DiscordID: interaction.user.id }).select({ Muted: 1, _id: 0 })
                isMuted = result[0].Muted
                if (isMuted == false) {
                    await interaction.reply({
                        content: `Birthday reminders are allready unmuted.`,
                        ephemeral: true
                    })
                } else {
                    //update db
                    Subscription.findOneAndUpdate({ DiscordID: interaction.user.id }, { Muted: false }, function (err, res) {
                        if (err) return console.error(err)
                    })
                    await interaction.reply({
                        content: `Birthday reminders unmuted.`,
                        ephemeral: true
                    })
                }
                break
            case 'delete':
                const deletename = interaction.options.getString('name').replace(/[^\x00-\x7F]/g, "")//get rid of circle and all other unicdoe
                deleteBirthday(interaction, client, deletename)
                break
            case 'edit':
                const editname = interaction.options.getString('name').replace(/[^\x00-\x7F]/g, "")//get rid of circle and all other unicdoe
                const newname = interaction.options.getString('newname') ?? 'Dont Change'
                const newday = interaction.options.getInteger('newday') ?? 'Dont Change'
                const newmonth = interaction.options.getString('newmonth') ?? 'Dont Change'
                editBirthday(interaction, client, editname, newname, newday, newmonth)
                break
            case 'next':
                const numberOfBirthdays = interaction.options.getInteger('number') ?? 5
                const type = interaction.options.getString('type') ?? 'subscribed'
                console.log(type)
                nextBirthdays(interaction, client, numberOfBirthdays, type)
                break
            case 'export':
                exportBirthdays(interaction, client)
                break
            case 'import':
                importBirthdays(interaction, client)
            default:
                break
        }
    },
    preferencesPeople,
    preferencesReminders,
    addBirthday,
    deleteBirthday,
    editBirthday,
    nextBirthdays,
    exportBirthdays,
    importBirthdays
}
async function checkAndCreateSubProfileIfNotHasOne(interaction) {
    //first check if the user has a thing in the database
    result = await Subscription.find({ DiscordID: interaction.user.id })

    //if not create one for them
    if (result.length == 0) {
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
            Muted: false,
            TempExport: []
        })
        //save
        await newSubscription.save().catch(console.error)

        console.log(chalk.blue(`[Database]: User: ${username} has been added to the subscriptions colleciton`))
    }
}


async function preferencesPeople(interaction, client) {
    //does as the name suggests
    checkAndCreateSubProfileIfNotHasOne(interaction)

    //code is in a button file so it can be executed when pressing nav buttons
    await client.buttons.get('ButtonBday').execute(interaction, client, 'BIRTHDAY:initiate:ButtonBday:0')
}

async function preferencesReminders(interaction, client) {
    //does as the name suggests
    checkAndCreateSubProfileIfNotHasOne(interaction)

    //make buttons
    Ondaybutton = new ButtonBuilder().setCustomId('BIRTHDAY:OnDay:birthdayToggle:NA:OnDay').setLabel('On Day')
    Daybeforebutton = new ButtonBuilder().setCustomId('BIRTHDAY:DayBefore:birthdayToggle:NA:DayBefore').setLabel('Day Before')
    Weekbeforebutton = new ButtonBuilder().setCustomId('BIRTHDAY:WeekBefore:birthdayToggle:NA:WeekBefore').setLabel('Week Before')
    Monthbutton = new ButtonBuilder().setCustomId('BIRTHDAY:ThisMonth:birthdayToggle:NA:ThisMonth').setLabel('This Month').setDisabled(true)

    //get db
    result = await Subscription.find({ DiscordID: interaction.user.id }).select({ _id: 1, OnDayReminder: 1, DayBeforeReminder: 1, WeekBeforeReminder: 1, ThisMonthReminder: 1 })

    //make buttons correct
    const { OnDayReminder, DayBeforeReminder, WeekBeforeReminder, ThisMonthReminder } = result[0]
    if (OnDayReminder) Ondaybutton.setStyle(ButtonStyle.Success); else Ondaybutton.setStyle(ButtonStyle.Danger)
    if (DayBeforeReminder) Daybeforebutton.setStyle(ButtonStyle.Success); else Daybeforebutton.setStyle(ButtonStyle.Danger)
    if (WeekBeforeReminder) Weekbeforebutton.setStyle(ButtonStyle.Success); else Weekbeforebutton.setStyle(ButtonStyle.Danger)
    if (ThisMonthReminder) Monthbutton.setStyle(ButtonStyle.Success); else Monthbutton.setStyle(ButtonStyle.Danger)

    //make aciton row
    buttonRow = new ActionRowBuilder().addComponents(Ondaybutton, Daybeforebutton, Weekbeforebutton, Monthbutton)

    //make embed
    Embed = new EmbedBuilder()
        .setTitle('Birthday Frequency Preferences')
        .setDescription('Pick when you want to be reminded about peoples Birthdays')
        .setColor(client.colour)
        //.setImage()
        .setThumbnail(`https://e7.pngegg.com/pngimages/199/741/png-clipart-party-popper-cartoon-illustration-party-popper-emoji-confetti-kids-bubble-fitness-app-holidays-text.png`)
        .setTimestamp(Date.now())
        .setFooter({
            iconURL: client.user.displayAvatarURL(),
            text: client.user.tag,
        })
        .addFields([
            {
                name: 'On Day',
                value: 'Sends you a message on the day of birthdays you are being notified about.'
            },
            {
                name: 'Day Before',
                value: 'Sends you a message the day before the birthdays you are being notified about.'
            },
            {
                name: 'Week Before',
                value: 'Sends you a message before each birthday you are being notified about.'
            },
            {
                name: 'This Month',
                value: 'Sends you a list of peoples birthday in the month on the 1st of each month. (Not implimented)'
            }
        ])
    await interaction.reply({
        content: `no way`,
        ephemeral: true,
        embeds: [Embed],
        components: [buttonRow],
        fetchReply: true
    })
}

async function addBirthday(interaction, client, name, day, month) {
    //check if anyone with the same name is allready in the colleciton
    result = await Birthday.find({ Name: name })
    if (result.length > 0) {
        //if it is not a private name that is being duped, there can be multiple private things with the same name
        CreatedBy = result[0].CreatedByDiscordId
        if (CreatedBy == interaction.user.id) {
            await interaction.reply({
                content: `The name ${name} Is allready in the database, their birthday is stored as ${result[0].Date}.\nIf this is not who you are trying to add, sorry, add a second name or use a variation of the name.`,
                ephemeral: true
            })
            return
        }
    }

    //make a date, day is a number 1 to 31, month is a number 1 to 12
    date = `${day}/${month}`

    //make new birthday item to add to colleciton
    brithdayItem = await new Birthday({
        _id: mongoose.Types.ObjectId(),
        Name: name,
        Date: date,
        CreatedByDiscordId: interaction.user.id
    })

    //save
    await brithdayItem.save().catch(console.error)

    await interaction.reply({
        content: `**${name}** has now been added to the birthdays list.`,
        ephemeral: true
    })
    console.log(chalk.blue(`[Database]: Person: ${name} has been added to the birthdays colleciton`))
}

async function deleteBirthday(interaction, client, name) {
    //get name
    result = await Birthday.find({ Name: name, CreatedByDiscordId: interaction.user.id }).select({ Name: 1, CreatedByDiscordId: 1, _id: 0 })

    if (result.length == 0) {
        await interaction.reply({
            content: `${name} was not in the reminders list, the search is very sensitive, try /birthday list to see who is in the birthday reminders list.`,
            ephemeral: true
        })
        return
    }
    //there should only be one result, but deletes the first result in any case
    deleteUser = result[0].Name
    CreatedById = result[0].CreatedByDiscordId
    //If there is nobody in the database with that name
    if (!deleteUser) {
        await interaction.reply({
            content: `${name} was not in the reminders list, the search is very sensitive, try /birthday list to see who is in the birthday reminders list.`,
            ephemeral: true
        })
        return
    }
    //console.log(interaction.member.permissions.toArray())//testing
    //If you are admin (or me) you can bypass the check to see if you made the member

    //this perms thing needs work
    if (CreatedById != interaction.user.id && !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) { //&& !message.user.id == '619826088788623361'
        await interaction.reply({
            content: `You cannot delete ${name} as you did not add them, you can ask an admin.`,
            ephemeral: true
        })
        return
    }
    //try catch loop for deleting user from the reminders list
    try {
        await Birthday.deleteOne({ Name: name })
        await interaction.reply({
            content: `${name} was removed from the birthday reminders list.`,
            ephemeral: true
        })
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: `There was an error deleting ${name} from the database.`
        })
    }
}

async function editBirthday(interaction, client, name, newname, newday, newmonth) {
    // check the new name does not conflict
    check = await Birthday.find({ Name: newname })
    if (check.length > 0) {
        CreatedBy = check[0].CreatedByDiscordId
        if (CreatedBy == interaction.user.id) {
            await interaction.reply({
                content: `The name ${newname} Is allready in the database, their birthday is stored as ${check[0].Date}.\nIf this is not who you are trying to add, sorry, add a second name or use a variation of the name.`,
                ephemeral: true
            })
            return
        }
    }

    //check if a user exists
    result = await Birthday.find({ Name: name, CreatedByDiscordId: interaction.user.id })

    if (result.length == 0) {
        await interaction.reply({
            content: `${name} was not in the reminders list, the search is very sensitive, try /birthday list to see who is in the birthday reminders list.`,
            ephemeral: true
        })
        return
    }
    if (newname == 'Dont Change' && newday == 'Dont Change' && newmonth == 'Dont Change') {
        await interaction.reply({
            content: `there is inputed nothing to change`,
            ephemeral: true
        })
        return
    }
    //new name
    if (newname == 'Dont Change') newname = result[0].Name

    //calculate new date
    if (newday == 'Dont Change') newday = result[0].Date.split('/')[0]
    if (newmonth == 'Dont Change') newmonth = result[0].Date.split('/')[1]
    newdate = `${newday}/${newmonth}`

    //replace
    Birthday.findOneAndUpdate({ Name: name }, { Name: newname, Date: newdate }, async function (err, res) {
        if (err) {
            console.error(err)
            console.log(chalk.red(`[Database]: ${name} Failed to update in birthday collection.`))
            await interaction.reply({
                content: `something went wrong when trying to update ${name}`,
                ephemeral: true
            })
            return
        } else {
            console.log(chalk.blue(`[Database]: ${name} Updated in birthday collection.`))
            await interaction.reply({
                content: `Succesfully updated ${name} in the birthday reminder list, new details:\nName: ${newname}\nBirthday: ${newdate}\n`,
                ephemeral: true
            })
        }
    })
}

async function nextBirthdays(interaction, client, number, type) { //type can be 'all' or 'subscribed'
    checkAndCreateSubProfileIfNotHasOne(interaction)

    result = await Birthday.find({ CreatedByDiscordId: interaction.user.id, }).select({ Name: 1, Date: 1 })
    sorted = await result.sort((a, b) => a.Date.split('/')[1] - b.Date.split('/')[1] || a.Date.split('/')[0] - b.Date.split('/')[0])
    if (type == 'subscribed') {
        subscriptionList = await Subscription.find({ DiscordID: interaction.user.id }).select({ RemindersArray: 1 })
        reminders = subscriptionList[0].RemindersArray
        filtered = await sorted.filter(birthday => reminders.includes(birthday._id) === true)
        data = filtered
    } else {
        data = sorted
    }
    today = new Date()
    let [today_day, today_month] = [today.getDate(), today.getMonth() + 1]
    today_day = '25'
    let firstIndex = 0

    // find the next birthday
    let i = 0
    for (birthday of data) {
        console.log(i, birthday)
        let [bday_day, bday_month] = birthday.Date.split('/')
        if (bday_month > today_month) {
            firstIndex = i
            break
        } else {
            if (bday_month == today_month) {
                if (bday_day >= today_day) {
                    break
                }
            }
        }
        i++
    }

    let index = firstIndex
    let birthdaysToShow = []
    while (true) {
        birthdaysToShow.push(data[index])
        if (birthdaysToShow.length >= number) break
        index++
        if (index > data.length - 1) index = 0
    }

    let nextBdaysEmbed = new EmbedBuilder()
        .setTitle(`Next ${number} Birthdays`)
        .setDescription(`The next ${number} upcoming birthdays ${type == 'all' ? 'whether you are subscribed to them or not are:' : 'that you have reminders turned on for are:'}`)
        .setColor(client.colour)
        .setTimestamp(Date.now())
        .setFooter({
            iconURL: client.user.displayAvatarURL(),
            text: client.user.tag,
        })
        .addFields(birthdaysToShow.map(birthday => {
            if (birthday) {
                return {
                    name: birthday.Name,
                    value: birthday.Date
                }
            } else {
                return {
                    name: 'Error',
                    value: 'Error'
                }
            }
        }))

    await interaction.reply({
        content: '',
        embeds: [nextBdaysEmbed],
        ephemeral: true
    })
}

async function exportBirthdays(interaction, client) {
    checkAndCreateSubProfileIfNotHasOne(interaction)

    //code is in the button for 
    await client.buttons.get('ButtonBdayExport').execute(interaction, client, 'BIRTHDAY:initiate:ButtonBdayExport:0')
}

async function importBirthdays(interaction, client) {
    const modal = new ModalBuilder()
        .setCustomId('importModal')
        .setTitle('Birthdays Import')
    
    const input = new TextInputBuilder()
        .setCustomId('importText')
        .setLabel('paste the text from a bestie bot export here')
        .setStyle(TextInputStyle.Paragraph)
    
    modal.addComponents(new ActionRowBuilder().addComponents(input))
    
    await interaction.showModal(modal)
}