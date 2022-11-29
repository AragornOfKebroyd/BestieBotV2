module.exports = {
  //scripts that can be run from the terminal
  apps : [
    {
      name:"index",
      script: 'node \"index.js\"', //main file
      watch: true //any changes will cause a restart
    }, 
    {
      name:"deploy",
      script: 'node \"deploy-commands.js\"', //upload new commands
      watch: true
    }
  ],/*
  deploy : {
    production : {
      //key: 'C:\\Users\\benja\\OneDrive\\Documents\\My Documents\\Programming\\Discord\\AWS stuff\\bestiebotidkwhatthisisfororifitshouldbesecure98398423784y873yhr748y3hf87ghfhe87h3hh273.pem',
      user : 'ubuntu',
      host : '172.31.38.90',
      ref  : 'origin/main',
      repo : 'https://github.com/AragornOfKebroyd/BestieBotV2',
      fetch: 'all',
      path : '/home/ubuntu',
      'post-deploy' : 'npm install && pm2 reload pm.config.js'
    }
  }*/
};