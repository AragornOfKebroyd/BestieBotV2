const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')
const mongoose = require("mongoose")
const { connect } = require('mongoose')
const Guild = require('../../schemas/guild')
const chalk = require('chalk')

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
				.setName('name')
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
						choices.push({name: channel.name, value: channel.id})
					}
				}
			} else if (channels[0] == 0){
			} else {
				for (chanID of channels){
					channel = client.channels.cache.get(chanID)
					if (channel == undefined) {
						if (choices.find(obj => obj.name == 'deleted channels') == undefined){
							choices.push({name:'deleted channels', value: 'Del'})
						}
					} else {
						choices.push({name: channel.name, value: channel.id})
					}
				}
			}
        } else if (interaction.options.getSubcommand() == 'add_channel'){
			channels = await Guild.find({ guildId: interaction.guild.id }).select({ ChannelID:1, _id: 0 }) 
			channels = channels[0].ChannelID.split(",")
			if (channels[0] != '-1'){
				allChannels = client.guilds.cache.get(interaction.guild.id).channels.cache.values()
				for (channel of allChannels){
					if (channel.type == 0){
						if (channels.includes(`${channel.id}`)){ continue }
						choices.push({name: channel.name, value: channel.id})
					}
				}
			}
		}
		const filtered = choices.filter(choice => choice.name.startsWith(focusedValue))
		await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.value })).slice(0, 25),
		)
	},

	async execute(interaction, client) {
		//special case so admin can allways use setup command
		if (interaction.member.permissions.has('ADMINISTRATOR') != true && interaction.user.id != client.Aragorn){
			return
		}
		switch (interaction.options.getSubcommand()) {
			case "add_channel":
				channel = interaction.options.getString('name')
				await addChannel(client, interaction, channel)
				break
			case "remove_channel":
				channel = interaction.options.getString('name')
				await removeChannel(client, interaction, channel)
				break
			case "add_all_channels":
				await addAllChannels(client, interaction)
				break
			case "remove_all_channels":
				await remAllChannels(client, interaction)
				break
			default:
				break
		}
	},
	addChannel,
	removeChannel,
	addAllChannels,
	remAllChannels,
}

async function addChannel(client, interaction, channel) {
	specifiedChannel = await interaction.guild.channels.cache.get(channel)
	if (specifiedChannel == undefined){ // does not exist
		await interaction.reply({
			content: `this channel does not exist, or something went wrong`,
			ephemeral: true
		})
		return
	}
	channelName = specifiedChannel.name
	current = await Guild.findOne({ guildId : interaction.guild.id }).select({_id : 0, ChannelID : 1 })
	currentChannels = current.ChannelID.split(',')
	
	if (currentChannels[0] == '-1'){ // allready got all of the channels
		await interaction.reply({
			content: `you allready have all channels allowed`,
			ephemeral: true
		})
		return
	} else if (currentChannels[0] == '0') { //remove 0
		newArray = channel
		Guild.findOneAndUpdate({ guildId : interaction.guild.id }, { ChannelID: newArray }, async function(err,res){
			if (err) {
				console.error(err)
				console.log(chalk.red(`[Database]: ${interaction.guild.name} Failed to update in guild settings.`))
				await interaction.reply({
					content: `something went wrong when trying to add ${channelName} to allowed channels`,
					ephemeral: true
				})
				return
			} else {
				console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
				await interaction.reply({
					content: `Succesfully updated ${interaction.guild.name} in the server settings, added: ${channelName}`,
					ephemeral: true
				})
				return
			}
		})
	} else if (currentChannels.includes(channel)){ // allready in the list
		await interaction.reply({
			content: `this channel is allready in the list of allowed channels`,
			ephemeral: true
		})
		return
	} else {
		newArray = currentChannels
		newArray.push(channel)
		newArray = newArray.join(',')
		Guild.findOneAndUpdate({ guildId : interaction.guild.id }, { ChannelID: newArray }, async function(err,res){
			if (err) {
				console.error(err)
				console.log(chalk.red(`[Database]: ${interaction.guild.name} Failed to update in guild settings.`))
				await interaction.reply({
					content: `something went wrong when trying to add ${channelName} to allowed channels`,
					ephemeral: true
				})
				return
			} else {
				console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
				await interaction.reply({
					content: `Succesfully updated ${interaction.guild.name} in the server settings, added: ${channelName}`,
					ephemeral: true
				})
				return
			}
		})
		return
	}
}

async function removeChannel(client, interaction, channel) {
	specifiedChannel = await interaction.guild.channels.cache.get(channel)
	if (specifiedChannel == undefined){ // does not exist
		await interaction.reply({
			content: `this channel does not exist, or something went wrong`,
			ephemeral: true
		})
		return
	}
	channelName = specifiedChannel.name
	current = await Guild.findOne({ guildId : interaction.guild.id }).select({_id : 0, ChannelID : 1 })
	currentChannels = current.ChannelID.split(',')

	if (currentChannels[0] == '0'){
		await interaction.reply({
			content: `There are allready no channels that the bot can be used in`,
			ephemeral: true
		})
		return
	} else if (currentChannels[0] == '-1') {
		allChannels = client.guilds.cache.get(interaction.guild.id).channels.cache.values()
		newArray = []
		for (possibleChannel of allChannels){
			if (possibleChannel.type == 0){
				chanId = possibleChannel.id
				if (chanId != channel){
					newArray.push(chanId)
				}
			}
		}
		newArray = newArray.join(',')
		Guild.findOneAndUpdate({ guildId : interaction.guild.id }, { ChannelID: newArray }, async function(err,res){
			if (err) {
				console.error(err)
				console.log(chalk.red(`[Database]: ${interaction.guild.name} Failed to update in guild settings.`))
				await interaction.reply({
					content: `something went wrong when trying to remove ${channelName} from allowed channels`,
					ephemeral: true
				})
				return
			} else {
				console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
				await interaction.reply({
					content: `Succesfully updated ${interaction.guild.name} in the server settings, removed: ${channelName}`,
					ephemeral: true
				})
				return
			}
		})
	} else if (currentChannels.includes(channel) == false) {
		await interaction.reply({
			content: `${channelName} is not in the allowed channels list`,
			ephemeral: true
		})
		return
	} else {
		newArray = []
		for (chanId of currentChannels){
			if (chanId != channel){
				newArray.push(chanId)
			}
		}
		newArray = newArray.join(',')
		Guild.findOneAndUpdate({ guildId : interaction.guild.id }, { ChannelID: newArray }, async function(err,res){
			if (err) {
				console.error(err)
				console.log(chalk.red(`[Database]: ${interaction.guild.name} Failed to update in guild settings.`))
				await interaction.reply({
					content: `something went wrong when trying to remove ${channelName} from allowed channels`,
					ephemeral: true
				})
				return
			} else {
				console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
				await interaction.reply({
					content: `Succesfully updated ${interaction.guild.name} in the server settings, removed: ${channelName}`,
					ephemeral: true
				})
				return
			}
		})
	}
}

async function addAllChannels(client, interaction) {
	Guild.findOneAndUpdate({ guildId : interaction.guild.id }, { ChannelID: '-1' }, async function(err,res){
		if (err) {
			console.error(err)
			console.log(chalk.red(`[Database]: ${interaction.guild.name} Failed to update in guild settings.`))
			await interaction.reply({
				content: `something went wrong when trying to add all channels`,
				ephemeral: true
			})
			return
		} else {
			console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
			await interaction.reply({
				content: `Succesfully updated ${interaction.guild.name} in the server settings, allowed all channels`,
				ephemeral: true
			})
			return
		}
	})
}

async function remAllChannels(client, interaction) {
	Guild.findOneAndUpdate({ guildId : interaction.guild.id }, { ChannelID: '0' }, async function(err,res){
		if (err) {
			console.error(err)
			console.log(chalk.red(`[Database]: ${interaction.guild.name} Failed to update in guild settings.`))
			await interaction.reply({
				content: `something went wrong when trying to remove all channels`,
				ephemeral: true
			})
			return
		} else {
			console.log(chalk.blue(`[Database]: ${interaction.guild.name} Updated in guild settings.`))
			await interaction.reply({
				content: `Succesfully updated ${interaction.guild.name} in the server settings, removed all channels`,
				ephemeral: true
			})
			return
		}
	})
}