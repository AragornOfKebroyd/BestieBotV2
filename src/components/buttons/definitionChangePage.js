const { ButtonStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const Word = require('../../schemas/words.js');
const chalk = require('chalk')


module.exports = {
    data: {
        name: 'DefinitionButton' 
    },
    async execute(interaction, client, customId) {
        [command, chosenWord, page] = [customId.split(':')[1], customId.split(':')[4], parseInt(customId.split(':')[3])]
        if (command == 'initiate'){
            page = 0
            replyflag = true
        } else if (command == 'next'){
            page = page + 1
            replyflag = false
        } else if (command == 'prev'){
            page = page - 1
            replyflag = false
        }

        result = await Word.find({'Word': `${chosenWord.toLowerCase()}`, 'wordType': typeChosen});
        //calculate the number of pages needed
        numOfPages = result.length

        //get current page
        wordresult = result[page]

        //checks and amendments on the current page
        if (wordresult.wordType == 'Normal'){
            typeofword = 'English Dictionary'
        } else if (wordresult.wordType == 'Urban'){
            typeofword = 'Urban Dictionary'
        }
        //give word types
        if (!wordresult.Type) {
            groups = ''
        }else {
            groups = wordresult.Type
        }

        //create embed of current page
        let currentembed = new EmbedBuilder()
            .setTitle(`${wordresult.Word}       ${groups}`)
            .setDescription(`Definition ${page+1}/${numOfPages}`)
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
        
        //make nav buttons
        leftbutton = new ButtonBuilder()
            .setLabel("◀️")
            .setCustomId(`DEFINITION:prev:DefinitionButton:${page}:${chosenWord}`)//.setCustomId(`BIRTHDAY:prev:ButtonBday:${page}`)
            .setStyle(ButtonStyle.Primary)

        if (page == 0){
            leftbutton.setDisabled(true)
        }
        rightbutton = new ButtonBuilder()
            .setLabel("▶️")
            .setCustomId(`DEFINITION:next:DefinitionButton:${page}:${chosenWord}`)
            .setStyle(ButtonStyle.Primary)
        if (page == numOfPages-1){
            rightbutton.setDisabled(true)
        }
        buttonRow = new ActionRowBuilder()
            .addComponents([
                leftbutton, 
                rightbutton
            ])
        
        if (replyflag == true){
            await interaction.editReply({
                content:`${numOfPages} Definitions found.`,
                ephemeral: true,
                embeds: [currentembed],
                components: [buttonRow],
                fetchReply: true
            })
        } else {
            await interaction.update({
                embeds: [currentembed],
                components: [buttonRow] 
            })
        }
    }
}