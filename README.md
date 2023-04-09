# BestieBotV2
A personal project discord bot with some cool functionality including reminders, database managmnet, fun features and more<br />
Youll need to create a config file as it has been ommited<br />
{<br />
⋅⋅⋅"token" : "Your Token",<br />
⋅⋅⋅"testingtoken" : "If you want to test",<br />
⋅⋅⋅"oldtoken": "Not needed",<br />
⋅⋅⋅"mongoDBtoken": "For database",<br />
⋅⋅⋅"clientId" : "Bots client Id",<br />
⋅⋅⋅"clientIdTest": "Testing Bots client Id",<br />
⋅⋅⋅"clientIdOld": "Not needed",<br />
⋅⋅⋅"guildId" : "Guild ID for your testing",<br />
⋅⋅⋅"OwnerId": "Your ID", <br />
⋅⋅⋅"openAIkey": "Open AI key, for battle command",<br />
⋅⋅⋅"requestsChannel": "where the bot will send "<br />
}<br />
run commands are<br />
npm run test  - only registers commands in test server on test token<br />
npm run all   - registers commands everywhere, but still on test token<br />
npm run prod  - registers commands everywhere on real token<br />
