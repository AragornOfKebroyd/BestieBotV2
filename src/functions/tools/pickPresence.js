const { ActivityType } = require('discord.js')

module.exports = (client) => {
    client.pickPresence = async() => {
        //ActivityType.Watching, ActivityType.Listening, ActivityType.Playing, ActivityType.Competing, ActivityType.Streaming, ActivityType.Custom
        const presenceOptions = [
			{
				type: ActivityType.Listening,
				text: 'Listening to lofi blip bot beats',
				status: 'online'
			},
			{
				type: ActivityType.Playing,
				text: 'Playing 8D minesweeper',
				status: 'online'
			},
			{
				type: ActivityType.Competing,
				text: 'Competing in being the best bot',
				status: 'online'
			},
			{
				type: ActivityType.Watching,
				text: 'Watching 30 Discord.JS tutorials at once',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing the harp',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Watching a nature documentary',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'Listening to the sound of bits flipping',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing conways game of life in conways game of life',
				status: 'online'
			},
            {
				type: ActivityType.Competing,
				text: 'Competing in being turing complete',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing debbuging wars',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing Hack-man',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'Listening to the 1984 audio book',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Watching the I.T. crowd',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing with a purple lightsaber',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'Listening to the minecraft soundtrack',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing Wii sports resort',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing AI sentience quiz',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Watching paint dry',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Watching grass grow',
				status: 'online'
			},
            {
				type: ActivityType.Competing,
				text: 'Competing in a race to see who can procrastinate the most',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing Stockfish 15 and winning (jk)',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Playing rock paper scissors with a brick wall',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Watching Cat videos',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Watching Tom Scott videos',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'Listening to The homework due date drawing closer',
				status: 'online'
			}
		]
        //first time
        if (typeof randomOption == 'undefined') randomOption = Math.floor(Math.random() * presenceOptions.length)
        //random option that isnt the previous
        pastOption = randomOption
        //generate first random option
        randomOption = Math.floor(Math.random() * presenceOptions.length)
        //keep going untill it is not the previous
        while (randomOption == pastOption){
            randomOption = Math.floor(Math.random() * presenceOptions.length)
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