const cron = require('node-cron')

module.exports = {
    cronInit() {
        //Runs every minuite
        cron.schedule('* * * * *', function() {
            console.log("hello")
        });
    }
}