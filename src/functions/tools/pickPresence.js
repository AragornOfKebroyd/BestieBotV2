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
			},
            {
				type: ActivityType.Playing,
				text: 'conways game of life in conways game of life',
				status: 'online'
			},
            {
				type: ActivityType.Competing,
				text: 'being turing complete',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'debbuging wars',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Hack-man',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'the 1984 audio book',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'the I.T. crowd',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'with a purple lightsaber',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'the minecraft soundtrack',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Wii sports resort',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'AI sentience quiz',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'paint dry',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'grass grow',
				status: 'online'
			},
            {
				type: ActivityType.Competing,
				text: 'a race to see who can procrastinate the most',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'Stockfish 15 and winning (jk)',
				status: 'online'
			},
            {
				type: ActivityType.Playing,
				text: 'rock paper scissors with a brick wall',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Cat videos',
				status: 'online'
			},
            {
				type: ActivityType.Watching,
				text: 'Tom Scott videos',
				status: 'online'
			},
            {
				type: ActivityType.Listening,
				text: 'The homework due date drawing closer',
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