//requirements
const cron = require('node-cron')
const checker = require('ikea-availability-checker');
const index = require("../../bot.js")
//specifics
const casper = "591984877927399425"
const ben = "619826088788623361"
const blahaj = '30373588'
const leeds = '261'; const manchester = '186'; const sheffield = '519';
const cities = [leeds, manchester, sheffield];

module.exports = {
    cronInit() {
        //Runs every 5 mins
        cron.schedule('*/5 * * * *', function() {
            main()
        });
    }
}

async function checkAvailability(storeID,productID) {
    //Checks an API for IKEA for the store and product to check the stock, result is an object
    const result = await checker.availability(storeID, productID);

    //check if it is out of stock, return, else, tell how much stock there is
    if (result.probability == "OUT_OF_STOCK" || result.stock == 0){
        return "NA"
    }
    answer = `${result.store.name} Ikea has ${result.stock} not blåhaj in stock!`;
    return answer;
}

async function main(){
    //itterate through all the cities in the list to check for availability
    for (let i = 0; i < cities.length; i++){
        result = await checkAvailability(cities[i],blahaj)
        if (result == "NA"){
            continue
        }
        index.DirectMessage(casper,result)
        index.DirectMessage(ben,result)
    }
}