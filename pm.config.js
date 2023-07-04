module.exports = {
  //scripts that can be run from the terminal
  apps : [
    {
      name:"bot",
      script: 'npm run prod', //main file
      watch: true //any changes will cause a restart
    }
  ]
}