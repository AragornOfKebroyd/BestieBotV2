const { REST } = require('@discordjs/rest')
const { Routes } = require('discord.js')
const fs = require('fs')
const { guildId } = require("../../../config.json")
const chalk = require('chalk')

module.exports = (client) => {
    client.handleCommands = async(token, clientId, where) => {
        const commandFolders = fs.readdirSync("./src/commands")

        //get all subfolders
        for (const folder of commandFolders){
            if (folder == 'testing') continue //dont add tesing commands
	        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'))
            const { commands, commandArray } = client
            //get all files within subfolders
	        for (const file of commandFiles){
                const command = require(`../../commands/${folder}/${file}`)
                //add all commands
                commands.set(command.data.name, command)
                
                //if there is an error to do with string primitives, its probably improper formating of the data in command files not being able to be jsonified, e.g no descriptions or wrong brackets
                commandArray.push(command.data.toJSON())
                
                console.log(chalk.yellow(`[CmdHandler]: Command: ${command.data.name} has passed through the handler`))//debugging
	        }
        }

        //add slash commands to the bot
        const rest = new REST({ version: '10' }).setToken(token)
        try {
            console.log(chalk.cyan("[CmdHandler]: Started refreshing application (/) commands."))
            if (where == 'testing'){
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { 
                    body: client.commandArray
                })
                //reset guild commands so there arent two versions
                await rest.put(Routes.applicationCommands(clientId), { 
                    body: []
                })
            }else if (where == 'everywhere'){
                await rest.put(Routes.applicationCommands(clientId), { 
                    body: client.commandArray
                })
                //reset guild commands so there arent two versions
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), { 
                    body: []
                })
            }
            console.log(chalk.green("[CmdHandler]: Succesfully reloaded application (/) commands."))
        } 
        catch (error) {
            console.error(error)
        }
    }
}
