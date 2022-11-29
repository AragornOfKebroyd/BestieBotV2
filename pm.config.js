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
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.175',
      ref  : 'origin/main',
      repo : 'git@github.com:repo.git',
      fetch: 'all',
      path : '/ubuntu',
      'post-deploy' : 'npm install && pm2 reload pm.config.js'
    }
  }
};