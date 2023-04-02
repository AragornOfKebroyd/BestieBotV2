const { SlashCommandBuilder, EmbedBuilder, UserSelectMenuBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suvat')
		.setDescription('generate a random suvat equation'),
        
	async execute(interaction, client) {
        
        itters = 300
        while (true){
            equation = generateSUVAT(itters)
            if (equation.length < 5950){
                break
            } else {
                itters = itters - 1
            }
        }
        
        equations = equation.match(/.{1,1024}/g)

        nomore = false
        if (equations.length <= 4){
            firstdesc = equations
            nomore = true
        }
        firstdesc = equations[0] + equations[1] + equations[2] + equations[3]
        fields = []
        if (nomore == false){
            numOfFields = equations.length - 4
            for (i = 0; i < numOfFields; i++){
                console.log(i)
                field = {name:'​',value:`${equations[i+4]}`} //name is a zero width space
                fields.push(field)
            }
        }

        embed = new EmbedBuilder()
            .setTitle(`**suvat equation:**`)
            .setDescription(`${firstdesc}`)
            .setColor(client.colour)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
            .addFields(fields)

        //reply
        await interaction.reply({
            embeds: [embed]
        })
	},
    generateSUVAT
}
function generateSUVAT(numofChanges){
    const originals = ['s = ut + 1/2at^2','s = vt - 1/2at^2','v^2 = u^2 + 2as','s = (v + u)t/2',' v = u + at']
    const switchers = {'s':'(ut + 1/2at^2)','u':'(v - at)','v':'((s + 1/2at^2)/t)','a':'((v^2 - u^2)/2s)','t':'(2s/(v + u))'}

    original = originals[Math.floor(Math.random() * 5)]
    prefix = original.split('=')[0] + '='
    equation = original.split('=')[1]

    for (i=0; i < numofChanges; i++){
        while (true){
            ind = Math.floor(Math.random() * equation.length-1)
            val = equation[ind]
            if (['s','u','v','a','t'].includes(val)){
                break
            } 
        }
        //val is one of suvat
        len = equation.length
        equation = equation.substring(0,ind-1) + switchers[val] + equation.substring(ind+1,len)
    }
    return prefix + equation
}
