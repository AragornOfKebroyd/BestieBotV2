const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
//toDo
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help command'),
		
	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		
		const embed = new EmbedBuilder()
            .setTitle('Xx Bestie Bot V2')
            .setURL('https://github.com/AragornOfKebroyd/BestieBotV2')
            .setDescription('**This is an overview of all commands of Xx Besite Bot V2**')
            .setColor(client.colour)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setAuthor({
                url: 'https://github.com/AragornOfKebroyd/BestieBotV2/blob/main/PRIVACY.md',
                iconURL: client.user.displayAvatarURL(),
                name: `Privacy Policy`
            })
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
            .addFields([
                {
                    name: 'battle (context)',
                    value: 'creates an AI generated fight scene between you and the user you used it on'
                },
                {
                    name: 'getAvatar (context)',
                    value: 'sends out the users avatar in your current channel, only you can see it'
                },
                {
                    name: '/bubblewrap',
                    value: 'sends some bubblewrap for you to pop!'
                },
                {
                    name: '/coinflip',
                    value: 'flips a coin, heads or tails'
                },
                {
                    name: '/rolldice',
                    value: 'you can role a dice with however many sides you specify'
                },
                {
                    name: '/hellothere',
                    value: 'replies with general kenobi'
                },
                {
                    name: '/l',
                    value: 'tells you the l constant'
                },
                {
                    name: '/suvat',
                    value: 'creates a ridiculously long, but correct suvat equation'
                },
                {
                    name: '/birthday add',
                    value: 'add a birthday reminder, you will need to enable it in preferences to get reminded about it'
                },
                {
                    name: '/birthday edit',
                    value: 'edit the name, or date of one of your reminders'
                },
                {
                    name: '/birthday delete',
                    value: 'remove a birthday reminder'
                },
                {
                    name: '/birthday mute',
                    value: 'dont recieve messages about birthdays until you unmute them'
                },
                {
                    name: '/birthday unmute',
                    value: 'resume getting messages about birthdays'
                },
                {
                    name: '/birthday preferences people',
                    value: 'brings up a menu only you can see to select who you want to get reminders for'
                },
                {
                    name: '/birthday preferences frequency',
                    value: 'you can choose whether you want to get reminded, on the day, the day before, the week before'
                },
                {
                    name: '/definition',
                    value: 'defines a word from the english dictionary, urban dictionary or both, and returns all definitions, will allways be hidden if you choose one containing Urban dictionary'
                },
                {
                    name: '/randomword',
                    value: 'gives you a word from the english dictionary, urban dictionary or both, will allways be hidden if you choose one containing Urban dictionary'
                },
                {
                    name: '/help',
                    value: 'this command'
                },
                {
                    name: '/linecount',
                    value: 'shows you how many lines of code this bot currently is, blimey mate'
                },
                {
                    name: '/ping',
                    value: 'shows you the bots ping and your ping'
                },
                {
                    name: '/request',
                    value: 'send a request for a feature to me'
                },
                {
                    name: '/setup',
                    value: 'only admins can use, specifies which channels the bot can be used in'
                },
                {
                    name: '/toggleHelloThere',
                    value: 'toggles whether the bot will reply to hello there, only admins can use'
                },
                {
                    name: '/toggleX',
                    value: 'toggles whether the bot will reply to x\'s, only admins can use'
                },
                {
                    name: '/userInfo',
                    value: ' tells you your tag and user ID'
                }
            ])

        await client.users.fetch(interaction.user.id, false).then((user) => {
            user.send({
                embeds: [embed]
            })
        })
        await interaction.reply({
            content: `You have been DM'd the help list`,
            ephemeral: true
        })
	},
}