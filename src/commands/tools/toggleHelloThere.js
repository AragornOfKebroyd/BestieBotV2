const Guild = require('../../schemas/guild')
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const chalk = require('chalk')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toggle-hello-there')
		.setDescription('Enable or disable Bestie Bot replying to Hello There')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => option
            .setName('choice')
            .setDescription('Enable or Disable')
            .setRequired(true)
            .addChoices(
                { name: 'View', value: 'view' },
                { name: 'Enable', value: 'enable' },
                { name: 'Disable', value: 'disable' })),
		
	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }
		const option = interaction.options.getString('choice')
        guildProfile = await Guild.findOne({ guildId: interaction.guild.id })
        HelloState = guildProfile.Hello

        if (option == 'view'){
            if (HelloState) state = "Enabled"; else state = "Disabled"
            await interaction.reply({
                content: `Hello There replies are ${state} on this server`,
                ephemeral: true
            })
        } else if (option == 'enable'){
            if (HelloState == true){
                await interaction.reply({
                    content: `Hello There replies are allready enabled on this server`,
                    ephemeral: true
                })
            }else {
                Guild.findOneAndUpdate({ guildId: interaction.guild.id }, { Hello: true }, async function(err,res){
                    if (err) {
                        console.error(err)
                        console.log(chalk.red(`[Database]: Error Updating ${interaction.guild.name} in Guild Database`))
                        await interaction.reply({
                            content: `something went wrong when trying to update ${interaction.guild.name}`,
                            ephemeral: true
                        })
                        return
                    } else {
                        console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
                        await interaction.reply({
                            content: `**Enabled** Hello There Replies in guild settings.`
                        })
                    }
                })
            }
        }else if (option == 'disable'){
            if (HelloState == false){
                await interaction.reply({
                    content: `Hello There replies are allready disabled on this server`
                })
            }else {
                Guild.findOneAndUpdate({ guildId: interaction.guild.id }, { Hello: false }, async function(err,res){
                    if (err) {
                        console.error(err)
                        console.log(chalk.red(`[Database]: Error Updating ${interaction.guild.name} in Guild Database`))
                        await interaction.reply({
                            content: `something went wrong when trying to update ${interaction.guild.name}`,
                            ephemeral: true
                        })
                        return
                    } else {
                        console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
                        await interaction.reply({
                            content: `**Disabled** Hello There Replies in guild settings.`
                        })
                    }
                })
            }
        }
	},
}