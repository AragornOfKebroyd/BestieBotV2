const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')
const mongoose = require("mongoose")
const { connect } = require('mongoose')
const Guild = require('../../schemas/guild')

//toDo
module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('setup the bot')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addSubcommand(subcommand => subcommand
            .setName('add_channel')
            .setDescription('add a channel where the bot can be interacted with.')
			.addStringOption(option => option
				.setName('channels')
				.setDescription('What channel should you be able to send messages. (not needed if you selected all)')
				.setAutocomplete(true)
				.setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('remove_channel')
			.setDescription('remove a channel where the bot can be interacted with.')
			.addStringOption(option => option
                .setName('name')
                .setDescription('Who do you want to delete')
                .setAutocomplete(true)
                .setRequired(true)))
		.addSubcommand(subcommand => subcommand
			.setName('add_all_channels')
			.setDescription('the bot will be able to be interacted with in all channels'))
		.addSubcommand(subcommand => subcommand
			.setName('remove_all_channels')
			.setDescription('the bot wont be able to be interacted with in all channels'))
		.addSubcommand(subcommand => subcommand
			.setName('test')
			.setDescription('test')),
	
	async autocomplete(interaction, client){
		const focusedValue = interaction.options.getFocused()
		choices = []
		if (interaction.options.getSubcommand() == 'remove_channel'){
			channels = await Guild.find({ guildId: interaction.guild.id }).select({ ChannelID:1, _id: 0 }) 
			channels = channels[0].ChannelID.split(",")

			if (channels[0] == '-1'){
				allChannels = client.guilds.cache.get(interaction.guild.id).channels.cache.values()
				for (channel of allChannels){
					if (channel.type == 0){
						choices.push(channel.name)
					}
				}
			} else {
				for (chanID of channels){
					channel = client.channels.cache.get(chanID)
					if (channel == undefined) {
						if (choices.includes('deleted channels') == false){
							choices.push('deleted channels')
						}
					} else {
						choices.push(channel.name)
					}
				}
			}
        } else if (interaction.options.getSubcommand() == 'add_channel'){
			channels = await Guild.find({ guildId: interaction.guild.id }).select({ ChannelID:1, _id: 0 }) 
			channels = channels[0].ChannelID.split(",")
			
			allChannels = client.guilds.cache.get(interaction.guild.id).channels.cache.values()
			for (channel of allChannels){
				if (channel.type == 0){
					if (channels.includes(`${channel.id}`)){ continue }
					console.log(channels, `${channel.id}`)
					choices.push(channel.name)
				}
			}
		}
		const filtered = choices.filter(choice => choice.startsWith(focusedValue))
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })).slice(0, 25),
		)
	},

	async execute(interaction, client) {
		//special case so admin can allways use setup command
		if (interaction.member.permissions.has('ADMINISTRATOR') == true || interaction.user.id == client.Aragorn){
		} else {
			// Check channel and user
			if (await client.checkChannel(interaction, client) == false) { return }
		}
		switch (interaction.options.getSubcommand()) {
			case "add_channel":
				
				break
			case "remove_channel":
				break
			default:
				break
		}
		
		await interaction.reply({
			content: `yup setting up sure is cool`,
			ephemeral: true
		})
	},
}