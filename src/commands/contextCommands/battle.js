const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { Configuration, OpenAIApi } = require("openai")
const { openAIkey } = require('../../../config.json')

//OpenAI Config
const configuration = new Configuration({
	apiKey: openAIkey,
})
const openai = new OpenAIApi(configuration)
const gpt = true //Not bad ~$0.0005 per text generation
const model = 'gpt-3.5'
//const model = 'curie'

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('battle')
		.setType(ApplicationCommandType.User),
	
	async execute(interaction, client) {
		//check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		//get option of user
		person = interaction.options._hoistedOptions[0].user
		//default text
        defaultText = `${interaction.user.username} fights ${person.username}`

		//defer reply
		await interaction.deferReply({ephemeral: false})

		resulttext = ""
		if (gpt == false){
			resulttext = defaultText
		} else {
			try {
				if (model == 'curie'){
					const completion = await openai.createCompletion({
						model: "text-curie-001", //best price performace tradeoff $0.002 per 1k tokens, so 500000 tokens per dollar
						prompt: `input: Write a 6 sentence paragraph friendly duel between ${interaction.user.username} and ${person.username}, both with random weapons. Nobody is hurt\noutput:`,
						frequency_penalty: 0.4,
						presence_penalty: 0.5,
						best_of: 1,
						top_p: 1,
						max_tokens: 256,
						temperature: 0.7
					})
					for (thing of completion.data.choices){
						resulttext = `${resulttext}${thing.text}`
					}
				} else if (model == 'gpt-3.5'){
					const completion = await openai.createChatCompletion({
						model:"gpt-3.5-turbo",
						messages:[
							{role: "system", content: "You are an author of epic duel fight scenes, when prompted with a choice of a random weapon, you will not just say random weapon, you will choose a weapon and describe it"},
							{role: "user", content: `Write a short 2 paragraph compelling and intense duel between ${interaction.user.username} and ${person.username}, both using cool and interesting random weapons, in a random location. Nobody should die or get badly injured, but there should be a winner.`}
						],
						max_tokens:350
					})
					resulttext = completion.data.choices[0].message.content
				} else {
					console.log('model not specified coorectly')
					resulttext = defaultText
				}
			} catch (error) {
				if (error.response) {
					console.log(error.response.status)
					console.log(error.response.data)
				} else {
					console.log(error.message)
				}
				resulttext = defaultText
			}
		}
		const image = new AttachmentBuilder('assets/images/battle_image.png')

		const Embed = new EmbedBuilder()
			.setTitle(`Battle between ${interaction.user.username} and ${person.username}`)
			.setDescription(`${resulttext}`)
			.setColor(client.colour)
			.setThumbnail(person.displayAvatarURL())
			.setImage('attachment://battle_image.png')
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			})

		await interaction.editReply({
            embeds: [Embed],
			files: [image]
        })
	},
}