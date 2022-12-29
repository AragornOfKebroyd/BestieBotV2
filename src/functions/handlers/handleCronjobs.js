const fs = require('fs');

module.exports = (client) => {
    client.handleCronjobs = async() => {
        const cronjobsFolders = fs.readdirSync("./src/cronjobs")

        //get all subfolders
        for (const folder of cronjobsFolders){
            
	        const cronjobsFiles = fs.readdirSync(`./src/cronjobs/${folder}`).filter(file => file.endsWith('.js'));
            //get all files within subfolders
	        for (const file of cronjobsFiles){
                const cronjob = require(`../../cronjobs/${folder}/${file}`)
                //start all cronjobs
                cronjob.cronInit()
	        }
        }
    }
}