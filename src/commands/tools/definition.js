const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const Word = require('../../schemas/words.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('definition')
		.setDescription('gives the definition of a given word if the bot knows it')
        .addStringOption(option => option
            .setName('word')
            .setDescription('the word you wish to learn the definition off.')
            .setRequired(true))
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
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
        //choices
        if (!interaction.options.getString('hidden')){
            hidden = true
        } else {
            hidden = (interaction.options.getString('hidden') == 'true')
        }
        if (!interaction.options.getString('choice')) {
            typeChosen = 'Normal'
        }else{
            typeChosen = interaction.options.getString('choice')
        }
        if (['all', 'Urban'].includes(typeChosen)){
            hidden = true
        }
        if (typeChosen == 'all'){
            typeChosen = ['Normal', 'Urban']
        }

        //defer
        await interaction.deferReply({
            fetchReply: true,
            ephemeral: hidden
        })

        //get the requested word
        chosenWord =  interaction.options.getString('word')

        //check there is at least on in the DB
        result = await Word.find({'Word': `${chosenWord.toLowerCase()}`, 'wordType': typeChosen})
        console.log(result)
        if (result.length == 0){
            interaction.editReply({
                content: 'Word not found',
                ephemeral: true
            })
            return
        }

        //if there is execute code in the button code so it can all go into a list
        await client.buttons.get('DefinitionButton').execute(interaction, client, `DEFINITION:initiate:DefinitionButton:0:${chosenWord}`)
	}
}