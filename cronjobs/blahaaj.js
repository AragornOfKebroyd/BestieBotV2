const cron = require('node-cron')
const checker = require('ikea-availability-checker');
const path = require('node:path');
const index = require(path.join(__dirname, "..", "/index.js"))
const casper = "591984877927399425"

const blahaaj = '30373588'
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
    const result = await checker.availability(storeID, productID);
    console.log(result.store.name ,result.probability,result.stock);
    if (result.probability != "OUT_OF_STOCK" && result.stock != 0){
        answer = `${result.store.name} Ikea has ${result.stock} blahaaj in stock!`
        return answer
    }
    return "hello"
}

async function main(){
    len = cities.length
    for (let i = 0; i < len; i++){
        result = await checkAvailability(cities[i],blahaaj)
        //index.DirectMessage(casper,result)
        index.DirectMessage("619826088788623361",result)
    }
}