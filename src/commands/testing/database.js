const Guild = require('../../schemas/guild');
const mongoose = require('mongoose')
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('database')
		.setDescription('Returns info from database')
        .addStringOption(option =>
            option
                .setName('operation')
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
            content: `Server: **${guildProfile.guildName}** has now been added to the database.`
        })
        console.log(chalk.blue(`[Database] Server: '${guildProfile.guildName}' Added to guild DB.`))
    }//if it exists
    else{
        await interaction.reply({
            content: `Server: **${guildProfile.guildName}** is allready in database.`
        })
    }
}

async function ViewDataBaseRecord(interaction){
    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id })
    if (!guildProfile){
        await interaction.reply({
            content: `Server: **${guildProfile.guildName}** is not in database.`
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
            content: `Server: **${guildProfile.guildName}** is not in database.`
        })
    }//if it exists
    else{
        await Guild.deleteOne({ _id: interaction.guild.id }).catch(console.error)
        await interaction.reply({
            content: `Server Name: **${guildProfile.guildName}** deleted from database.`
        })
    }
}