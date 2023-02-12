//requirements
const cron = require('node-cron')
const checker = require('ikea-availability-checker');

//specifics
const casper = "591984877927399425"
const ben = "619826088788623361"
const blahaj = '30373588'
const leeds = '261'; const manchester = '186'; const sheffield = '519';
const cities = [leeds, manchester, sheffield];

module.exports = {
    cronInit(client) {
        //Runs every day at 7:00
        cron.schedule('0 7 * * *', function() {
            main(client)
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
    answer = `${result.store.name} Ikea has ${result.stock} blåhaj in stock!`;
    return answer;
}

async function main(client){
    //itterate through all the cities in the list to check for availability
    for (let i = 0; i < cities.length; i++){
        result = await checkAvailability(cities[i],blahaj)
        if (result == "NA"){
            continue
        }
        client.users.fetch(casper, false).then((user) => {
            //user.send(result) //disabled for now
        })
        client.users.fetch(ben, false).then((user) => {
            //user.send(result) //disabled for now
        })
    }
}