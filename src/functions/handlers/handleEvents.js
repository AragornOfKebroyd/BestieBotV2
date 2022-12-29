const fs = require('fs');

module.exports = (client) => {
    client.handleEvents = async() => {
        const eventsFolders = fs.readdirSync("./src/events")

        //get all subfolders
        for (const folder of eventsFolders){
            
	        const eventsFiles = fs.readdirSync(`./src/events/${folder}`).filter(file => file.endsWith('.js'));
            //switch case for each possible folder
            switch (folder) {
                case "client":
                    //start all event listeners
                    for (const file of eventsFiles){
                        const event = require(`../../events/${folder}/${file}`)

                        //For multiple events on, for single events once (like ready)
	                    if (event.once){
		                    //event.name is the name of the event stored in each file, and event.execute is the function within the event files
		                    client.once(event.name, (...args) => event.execute(...args, client));
	                    } 
                        else{
		                    client.on(event.name, (...args) => event.execute(...args, client));
	                    }
                    }
                    break;
            
                default:
                    break;
            }
        }
    }
}