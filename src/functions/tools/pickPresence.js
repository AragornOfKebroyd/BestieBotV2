const { ActivityType } = require('discord.js')

module.exports = (client) => {
    client.pickPresence = async () => {
        //ActivityType.Watching, ActivityType.Listening, ActivityType.Playing, ActivityType.Competing, ActivityType.Streaming, ActivityType.Custom
        const presenceOptions = [
			{
				type: ActivityType.Listening,
				text: 'lofi blip bot beats',
				status: 'online'
			},
			{
				type: ActivityType.Playing,
				text: '8D minesweeper',
				status: 'online'
			},
			{
				type: ActivityType.Competing,
				text: 'being the best bot',
				status: 'online'
			},
			{
				type: ActivityType.Watching,
				text: '30 Discord.JS tutorials at once',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'the harp',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'a nature documentary',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'the sound of bits flipping',
				status: 'online'
			}
		]
        //first time
        if (typeof randomOption == 'undefined') randomOption = Math.floor(Math.random() * presenceOptions.length)
        //random option that isnt the previous
        pastOption = randomOption
        //generate first random option
        randomOption = Math.floor(Math.random() * presenceOptions.length);
        //keep going untill it is not the previous
        while (randomOption == pastOption){
            randomOption = Math.floor(Math.random() * presenceOptions.length);
        }
        
        option = presenceOptions[randomOption]

        //set presence
        client.user.setPresence({
            activities: [
                {
                    name: option.text,
                    type: option.type
                }
            ],
            status: option.status
        })
    }
}