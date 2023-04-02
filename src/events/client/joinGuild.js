const chalk = require('chalk')
const { ActionRow }  = require('discord.js')
const mongoose = require("mongoose")
const { connect } = require('mongoose')
const Guild = require('../../schemas/guild')

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		console.log('new server babe')
        let guildProfile = await Guild.findOne({ guildId: guild.id })
        if (!guildProfile){
            guildProfile = await new Guild({
                _id: mongoose.Types.ObjectId(),
                guildId: guild.id,
                guildName: guild.name,
                guildIcon: guild.iconURL() ? guild.iconURL() : "None",
                Xs: false,
                Hello: false,
                ChannelID: "setup",
                AllowedRoles: "setup",
            })
            
            await guildProfile.save().catch(console.error)
            
            //send message to server
            console.log(chalk.blue(`[Database]: Server: '${guild.name}' Added to guild DB.`))
        }//if it exists (ie its been reinvited)
        else{
            
        }
        //could put some cool into code in here, asking for a settup
	},
}