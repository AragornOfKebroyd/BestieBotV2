const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField } = require('discord.js');
//has errors, not sure why
module.exports = {
	data: new SlashCommandBuilder()
		.setName('permission')
		.setDescription('requires permission to get rid of a role and then get a new one')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
        //roles of the person who ran the command
        const { roles } = interaction.member;
        //get id
        const role = await interaction.guild.roles.fetch('1058366830600790057').catch(console.error)

        //if the test role does not exist make it
        otherrole = interaction.guild.roles.cache.find(role => role.name == "Test")
        if (!otherrole){
            //create role
            otherrole = await interaction.guild.roles.create({
                name: 'Test',
                permissions: [PermissionsBitField.Flags.ManageMessages]
            }).catch(console.error)
        }

        //if user has role
        if (roles.cache.has('1058366830600790057')){
            //make reply able to be edited later
            await interaction.deferReply({
                fetchReply: true
            })

            //remove role
            await roles.remove(role).catch(console.error) //error

            //edit reply
            await interaction.editReply({
                content: `Removed ${role.name} role from you very temporarly and gave you ${otherrole} role.`
            })
            
        }
        else {
            //reply if they dont have the role
            await interaction.reply({
                content: `You do not have the ${role.name} role`
            })
        }
        //add role back and new role
        if (roles.cache.some(role => role.name == 'Test') == false){
            await roles.add(otherrole).catch(console.error) //error
        }
        await roles.add(role).catch(console.error) //error
	},
};