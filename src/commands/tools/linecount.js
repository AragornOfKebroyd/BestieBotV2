const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs')
const path = require('path')
const acorn = require('acorn')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('linecount')
		.setDescription('how many lines of code is bestie bot'),

	async execute(interaction, client) {
        //check channel
		if (await client.checkChannel(interaction, client) == false) { return }

		const rootDir = path.join(__dirname, '..', '..', '..', 'src')
		await interaction.deferReply()
		lines = countLines(rootDir)

		await interaction.editReply({
		content: `Bestie Bot is currently ${lines} lines of code!`
		})
	},
	countLines
}

//chatgpt code lmao
function countLines(dir) {
let count = 0
const files = fs.readdirSync(dir)

for (const file of files) {
	const filePath = path.join(dir, file)
	const stat = fs.lstatSync(filePath)

	if (stat.isDirectory()) {
	count += countLines(filePath)
	} else if (path.extname(file) === '.js') {
	const code = fs.readFileSync(filePath, 'utf-8')
	const comments = []

	acorn.parse(code, {
		onComment: comments,
		locations: true,
		ecmaVersion: 2020
	})

	let inString = false
	for (let i = 0; i < code.length; i++) {
		if (code[i] === '"' || code[i] === "'" || code[i] === "`") {
		inString = !inString
		} else if (code[i] === '\n' && !inString) {
		count++
		}
	}
	}
}
return count
}