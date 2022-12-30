const Guild = require('../../schemas/guild');
const mongoose = require('mongoose')
const { SlashCommandBuilder } = require('discord.js');
const chalk = require('chalk')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Returns info from database')
        .addStringOption(option =>
            option
                .setName('operation')
                .setDescription('AAAAAAAAA')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'View', value: 'view' },
                    { name: 'Delete', value: 'delete' },
                )),
	async execute(interaction, client) {
        const option = interaction.options.getString('operation');
        switch (option) {
            case 'add':
                AddDatabaseReord(interaction)
                break;
            case 'view':
                ViewDataBaseRecord(interaction)
                break;
            case 'delete':
                DeleteDataBaseRecord(interaction)
                break;
            default:
                break;
        }
	},
    AddDatabaseReord,
    ViewDataBaseRecord,
    DeleteDataBaseRecord
};
async function AddDatabaseReord(interaction){
    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id })
    if (!guildProfile){
        guildProfile = await new Guild({
            _id: mongoose.Types.ObjectId(),
            guildId: interaction.guild.id,
            guildName: interaction.guild.name,
            guildIcon: interaction.guild.iconURL() ? interaction.guild.iconURL() : "None"
        })
        
        await guildProfile.save().catch(console.error)
        //send message to server
        await interaction.reply({
            content: `Server: **${interaction.guild.name}** has now been added to the database.`
        })
        console.log(chalk.blue(`[Database]: Server: '${interaction.guild.name}' Added to guild DB.`))
    }//if it exists
    else{
        await interaction.reply({
            content: `Server: **${interaction.guild.name}** is allready in database.`
        })
    }
}

async function ViewDataBaseRecord(interaction){
    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id })
    if (!guildProfile){
        await interaction.reply({
            content: `Server: **${interaction.guild.name}** is not in database.`
        })
    }//if it exists
    else{
        await interaction.reply({
            content: `Server Name: **${guildProfile.guildName}**\nServer Id: **${guildProfile.guildId}**\nServer Icon: ${guildProfile.guildIcon}`
        })
    }
}

async function DeleteDataBaseRecord(interaction){
    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id })
    if (!guildProfile){
        await interaction.reply({
            content: `Server: **${interaction.guild.name}** is not in database.`
        })
    }//if it exists
    else{
        try {
            await Guild.deleteOne({ guildId: interaction.guild.id })
            await interaction.reply({
                content: `Server Name: **${interaction.guild.name}** deleted from database.`
            })
            console.log(chalk.yellow(`[Database]:  Server: '${interaction.guild.name}' Removed from guild DB.`))
        } catch (error) {
            await interaction.reply({
                content: `Something went wrong when trying to delete **${interaction.guild.name}** from the database.`
            })
            console.log(chalk.red(`[Database]: Error: deleting ${interaction.guild.name} from the database`))
            console.error(error)
        }      
    }
}