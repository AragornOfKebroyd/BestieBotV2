module.exports = {
  apps : [
    {
      name: 'BestieBot',
      script: 'node \"index.js\"'
    }, 
    {
      name: 'DeployCommands',
      script: 'node \"deploy-commands.js\"'
    }
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js',
      'pre-setup': ''
    }
  }
};
