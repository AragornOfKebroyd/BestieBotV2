# BestieBotV2
A personal project discord bot with some cool functionality including reminders, database managmnet, fun features and more<br />
Youll need to create a config file as it has been ommited<br />
{<br />
»"token" : "Your Token",<br />
    __"testingtoken" : "If you want to test",<br />
    __"oldtoken": "Not needed",<br />
    __"mongoDBtoken": "For database",<br />
    __"clientId" : "Bots client Id",<br />
    __"clientIdTest": "Testing Bots client Id",<br />
    __"clientIdOld": "Not needed",<br />
    __"guildId" : "Guild ID for your testing",<br />
    __"OwnerId": "Your ID", <br />
    __"openAIkey": "Open AI key, for battle command",<br />
    __"requestsChannel": "where the bot will send "<br />
}<br />
run commands are<br />
npm run test  - only registers commands in test server on test token<br />
npm run all   - registers commands everywhere, but still on test token<br />
npm run prod  - registers commands everywhere on real token<br />
