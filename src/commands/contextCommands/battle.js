const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require("openai");
const { openAIkey } = require('../../../config.json');

//OpenAI Config
const configuration = new Configuration({
	apiKey: openAIkey,
})
const openai = new OpenAIApi(configuration);
const gpt = true //Not bad ~$0.0005 per text generation
const img = false //EXPENSIVE $0.016 per image

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('battle')
		.setType(ApplicationCommandType.User),
	
	async execute(interaction, client) {
		//get option of user
		person = interaction.options._hoistedOptions[0].user
		//default image
		defaultImgurl = 'https://img.pixers.pics/pho_wat(s3:700/FO/64/02/79/78/700_FO64027978_95430204dc02ac161b3eea894959e3b3.jpg,700,467,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,417,jpg)/throw-pillows-karate-at-sunset.jpg.jpg'
        defaultText = `${interaction.user.username} fights ${person.username}`
		await interaction.deferReply({ephemeral: false})
		resulttext = ""
		if (gpt == false){
			resulttext = defaultText
		}
		else{
			try {
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
			} catch (error) {
				if (error.response) {
					console.log(error.response.status);
					console.log(error.response.data);
				} else {
					console.log(error.message);
				}
				resulttext = defaultText
			}
		}

		if (img == false){
			generatedImageurl = defaultImgurl
		}else{
			try{
				response = await openai.createImage({
					prompt:`An vintage illustration image of this situation:\n${resulttext}`,
					n:1,
					size:'256x256'
				})
				generatedImageurl = response.data.data[0].url
			}
			catch(error){
				if (error.response) {
					console.log(error.response.status);
					console.log(error.response.data);
				} else {
					console.log(error.message);
				}
				generatedImageurl = defaultImgurl
			}
		}

		//maybe make a dalle image as well?
		const Embed = new EmbedBuilder()
			.setTitle(`Battle between ${interaction.user.username} and ${person.username}`)
			.setDescription(`${resulttext}`)
			.setColor(client.colour)
			.setThumbnail(person.displayAvatarURL())
			.setImage(generatedImageurl)
			.setTimestamp(Date.now())
			.setFooter({
				iconURL: client.user.displayAvatarURL(),
				text: client.user.tag,
			})

		await interaction.editReply({
            embeds: [Embed]
        })
	},
};