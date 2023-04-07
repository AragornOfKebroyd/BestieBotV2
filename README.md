# BestieBotV2
A personal project discord bot with some cool functionality including reminders, database managmnet, fun features and more
Youll need to create a config file as it has been ommited
{<br />
    "token" : "Your Token",<br />
    "testingtoken" : "If you want to test",<br />
    "oldtoken": "Not needed",<br />
    "mongoDBtoken": "For database",<br />
    "clientId" : "Bots client Id",<br />
    "clientIdTest": "Testing Bots client Id",
    "clientIdOld": "Not needed",
    "guildId" : "Guild ID for your testing",
    "OwnerId": "Your ID", 
    "openAIkey": "Open AI key, for battle command",
    "requestsChannel": "where the bot will send "
}
run commands are
npm run test  - only registers commands in test server on test token
npm run all   - registers commands everywhere, but still on test token
npm run prod  - registers commands everywhere on real token
