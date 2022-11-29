module.exports = {
  //scripts that can be run from the terminal
  apps : [
    {
      script: 'node \"index.js\"', //main file
      watch: true //any changes will cause a restart
    }, 
    {
      script: 'node \"deploy-commands.js\"', //upload new commands
      watch: true
    }
  ],

  gitclone : {
    
  }
  /*
  deploy : {
    production : {
      //actually no clue, this was just generated
      user : 'ubuntu',
      host : "192.168.0.15",
      ref  : 'origin/main',
      repo : 'https://github.com/AragornOfKebroyd/BestieBotV2',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 startOrRestart pm.config.js',
      'pre-setup': ''
    }
  }
  */
};