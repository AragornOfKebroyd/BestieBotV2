const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Word = require('../../schemas/words.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomword')
		.setDescription('generate a random word')
        .addStringOption(option => option
            .setName('choice')
            .setDescription('Type, Normal, Urban or All. defalut: Normal')
            .addChoices(
                { name: 'Normal', value: 'Normal' },
                { name: 'Urban Dictionary', value: 'Urban' },
                { name: 'All', value: 'all' }))
        .addStringOption(option => option
            .setName('hidden')
            .setDescription('Whether everyone can see it or just you. (Will not show everyone for Urban or All, too risky)')
            .addChoices(
                { name: 'True', value: 'true' },
                { name: 'False', value: 'false' })),

	async execute(interaction, client) {
        //choices
        if (!interaction.options.getString('hidden')) hidden = true; else {hidden = (interaction.options.getString('hidden') == 'true'); console.log("uwu",hidden)}
        if (!interaction.options.getString('choice')) typeChosen = 'Normal'; else typeChosen = interaction.options.getString('choice')
        if (['all', 'Urban'].includes(typeChosen)) hidden = true

        //defer
        await interaction.deferReply({
            fetchReply: true,
            ephemeral: hidden
        })
        
        //Get a random thing from DB
        if (typeChosen == "all"){
            //50 50 chance for each
            fiftyfifty = Math.floor(Math.random() * 2);
            if (fiftyfifty == 0) typeChosen = 'Normal'; else typeChosen = 'Urban'
        } 
        result = await Word.aggregate([
            { $match: { wordType: typeChosen } },
            { $sample: { size: 1 } }
        ])

        //checks and amendments
        wordresult = result[0]
        if (wordresult.wordType == 'Normal'){
            typeofword = 'English Dictionary'
        } else if (wordresult.wordType == 'Urban'){
            typeofword = 'Urban Dictionary'
        }
        if (!wordresult.Type) groups = '';else groups = wordresult.Type



		embed = new EmbedBuilder()
            .setTitle(`${wordresult.Word}       ${groups}`)
            .setColor(client.colour)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
            .addFields([
                {
                    name:`Definition from ${typeofword}:`,
                    value :`${wordresult.Description}`
                }
            ])

        await interaction.editReply({
            embeds: [embed],
            fetchReply: true
        })
	}
}