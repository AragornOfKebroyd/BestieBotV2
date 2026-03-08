const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { OpenAI } = require("openai")
const { openAIkey, UseAI } = require('../../../config.json')
const path = require('path')
const imageDir = path.join(__dirname, '..', '..', '..', 'assets', 'images')

//OpenAI Config
const openai = new OpenAI({
	apiKey: openAIkey,
})

const gpt = UseAI //Not bad ~$0.0005 per text generation

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
    defaultText = `${interaction.user.username} fights ${person.username} (AI generation is disabled for now)`

		//defer reply
		await interaction.deferReply({ephemeral: false})

		resulttext = ""
		if (gpt == false){
			resulttext = defaultText
		} else {
			try {
				const completion = await openai.chat.completions.create({
					messages: [
						{ role: "system", content: `You are a story writer of intense duels (300 token limit). Write a 4 sentence unique compelling and intense battle between ${interaction.user.username} and ${person.username}.
						They should both be using unique interesting random weapons, and be in a random location. Nobody should get badly injured, but there should be a winner.` }
					],
					model: "gpt-3.5-turbo-0125",
					frequency_penalty: 0.4,
					presence_penalty: 0.5,
					temperature: 1.5,
					n: 1,
					max_tokens: 300,
				});
				console.log(completion.choices[0].finish_reason)
				resulttext = completion.choices[0].message.content
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
		try {
			imagePath = path.join(imageDir, 'battle_image.png')
			const image = new AttachmentBuilder(imagePath)
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
		} catch (error) {
			const Embed = new EmbedBuilder()
			.setTitle(`Battle between ${interaction.user.username} and ${person.username}`)
			.setDescription(`${resulttext}`)
			.setColor(client.colour)
			.setThumbnail(person.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			})

			await interaction.editReply({
				embeds: [Embed]
			})
			console.log(error)
		}		
	},
}