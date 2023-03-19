const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('l')
		.setDescription('l'),
        
	async execute(interaction, client) {
        //calculate 'l'
        /*
        l = mao (ofc)
        m is mass = 12 (because x = 12 allways, and the mass is x as it is unknown therefore it is 12)
        a is acceleration = 27.1 (this is the value of gravity in APL)
        o = shit (ofc)
        s is displacment = 3mm = 3x10^-3m (the width of the letter o as it was written)
        h is H's age
        i = 1 (roman numerals)
        t is time = 80s (time it took to formulate this formula)
        */
        //mao
        m = 12
        a = 27

        //o
        s = 0.003
        i = 1
        h = H_age()
        t = 80
        
        o = s*h[0]*i*t
        o_reduced = s*h[1]*i*t

        //l
        l = m*a*o
        l_reduced = m*a*o_reduced

        embed = new EmbedBuilder()
            .setTitle('L (to 2 d.p.)')
            .setDescription(`exact 'l' constant: **${Math.round(l * 100) / 100}**\nreduced 'l' constant: **${Math.round(l_reduced * 100) / 100}**\noriginal 'l' constant: **1244.16**`)
            .setColor(client.colour)
            .setTimestamp(Date.now())
            .setFooter({
                iconURL: client.user.displayAvatarURL(),
                text: client.user.tag,
            })
        //reply
        await interaction.reply({
            embeds: [embed]
        })
	},
    H_age
}

function H_age(){
    //work out H's age
    dateofbirth = Date.parse("05 Jan 2006 00:00:00 GMT")
    now = Date.now()

    //divisor
    toyears = 1000 * 60 * 60 * 24 * 365.2422
    timediff = now - dateofbirth
    //float
    years = timediff / toyears
    //int
    yearsfloored = Math.floor(years)

    return [years, yearsfloored]
}