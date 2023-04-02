const mongoose = require("mongoose")
const { connect } = require('mongoose')
const Guild = require('../../schemas/guild')

module.exports = (client) => {
    client.checkChannel = async (interaction, client) => {
        inChannel = interaction.channel.id
        currentGuild = await Guild.findOne({ guildId: interaction.guild.id }).select({ ChannelID:1, _id: 0 })
        channels = currentGuild.ChannelID.split(",")

        //logic: '-1' all channels, '0' no channels, otherwise comma deliminated channelID's

        if (channels[0] == "-1") {
            return true
        } else if (channels[0] == "0") {
            await interaction.reply({
                content: `A moderator has not set up this bot to be able to be able to be used in any channels yet.`,
                ephemeral: true
            })
            return false
        } else {
            if (channels.includes(inChannel)){
                return true
            } else {
                channelInfo = channels.map(id => `<#${id}>`)
                await interaction.reply({
                    content: `You cannot use commands in this channel, use one of these channels: ${channelInfo.join(', ')}`,
                    ephemeral: true
                })
                return false
            }
        }
    }
}