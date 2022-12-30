const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('fs');
const { token, clientId, guildId } = require("../../../config.json")
const chalk = require('chalk');

module.exports = (client) => {
    client.handleCommands = async() => {
        const commandFolders = fs.readdirSync("./src/commands")

        //get all subfolders
        for (const folder of commandFolders){
            
	        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'));
            const { commands, commandArray } = client
            //get all files within subfolders
	        for (const file of commandFiles){
                const command = require(`../../commands/${folder}/${file}`)
                //add all commands
                commands.set(command.data.name, command);
                
                //if there is an error to do with string primitives, its probably improper formating of the data in command files not being able to be jsonified, e.g no descriptions or wrong brackets
                commandArray.push(command.data.toJSON())
                
                console.log(chalk.yellow(`[CmdHandler]: Command: ${command.data.name} has passed through the handler`))//debugging
	        }
        }
        //add slash commands to the bot
        const rest = new REST({ version: '10' }).setToken(token);
        try {
            console.log(chalk.cyan("[CmdHandler]: Started refreshing application (/) commands."))

            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { 
                body: client.commandArray
            })
            /* For all servers
            await rest.put(Routes.applicationCommands(clientId), { 
                body: commandArray 
            });
            */
            console.log(chalk.green("[CmdHandler]: Succesfully reloaded application (/) commands."))
        } 
        catch (error) {
            console.error(error)
        }
    }
}