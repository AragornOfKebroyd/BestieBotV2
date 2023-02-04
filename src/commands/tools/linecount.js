const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const acorn = require('acorn');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('linecount')
		.setDescription('how many lines of code is bestie bot'),
		
	async execute(interaction, client) {
        const rootDir = 'C:/Users/benja/OneDrive/Documents/My Documents/Programming/Discord/BestieBotV2/src';
        lines = countLines(rootDir)

		await interaction.reply({
			content: `Bestie Bot is currently ${lines} lines of code!`
		});
	},
    countLines
};

//chatgpt code lmao
function countLines(dir) {
  let count = 0;
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      count += countLines(filePath);
    } else if (path.extname(file) === '.js') {
      const code = fs.readFileSync(filePath, 'utf-8');
      const comments = [];

      acorn.parse(code, {
        onComment: comments,
        locations: true,
        ecmaVersion: 2020
      });

      let inString = false;
      for (let i = 0; i < code.length; i++) {
        if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
          inString = !inString;
        } else if (code[i] === '\n' && !inString) {
          count++;
        }
      }
    }
  }
  return count;
}