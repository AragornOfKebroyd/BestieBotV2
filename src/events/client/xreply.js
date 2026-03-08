const Guild = require('../../schemas/guild')
const mongoose = require('mongoose')
const accepetedX = ['x', 'х', 'ҳ', 'ӽ', 'ᶍ', 'ӿ', 'χ', 'ᕽ', 'ˣ', '×', '╳', '✕', '✖', '⨯', '✗', '✘', '🗴', '🗶', '☒', '🗵', '🗷', '☓', '🞩', '❌', '❎', '⨉', '🗙', '𝄪', 'א', '𝔛', '𝖃', '𝔵', '𝖝', 'ㄨ', 'メ', '乂', '㐅', 'ᚷ', 'ᚸ', 'لا']

/*//look, none of them are the same
for (index = 0; index < accepetedX.length;index++){
	for (compare = 0; compare < accepetedX.length;compare++){
		if (accepetedX[index] === accepetedX[compare] && index != compare){
			console.log(index, accepetedX[index], "\n", compare, accepetedX[compare])
		}
	}
}*/

module.exports = {
	name: 'messageCreate',
	execute(message) {
		//return if message is by a bot
		if (message.author.bot == true) return
		//main procedure
		main(message)
	},
};

async function main(userMsg){
	//check guild settins in database, if false return
	result = await Guild.findOne({ guildId: userMsg.channel.guild.id}).select({ Xs: 1, _id: 0})
	XsBool = result.Xs
	if (!XsBool) return
	
	//computation
	sendMsg = determineX(userMsg.content)
	if (sendMsg == 'valid') {
		await userMsg.reply("Ok bestie xx")
	}
}

function determineX(userMessage){
	//normalise the string, remove diactrics and accents
	userMessage = userMessage.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
	//whole whacky thing cause whacky characters are whacky
	userMessageArray = []
	for (codePoint of userMessage) {
		userMessageArray.push(String.fromCodePoint(codePoint.codePointAt(0)))
	}
	//console.log(userMessageArray)//debugging
	//itterate through string
	for (charInd = 0; charInd < userMessageArray.length; charInd++){
		char = userMessageArray[charInd]
		//if a character is an accepted x
		if (accepetedX.includes(char)){
			//check before and after to see if it is still valid
			beforeind = charInd-1
			afterind = charInd+1
			//if it is out of range of the list
			if (beforeind == -1){
				beforeflag = true
			}else{
				beforeflag = false
			}
			while (accepetedX.includes(userMessageArray[beforeind]) == true){
				beforeind--
				if (beforeind == -1){
					beforeflag = true
					break
				}
			}
			//If the thing after the x's is the end, this flag will be set to true
			if (afterind == userMessage.length){
				endflag = true
			} else {
				endflag = false
			}
			while (accepetedX.includes(userMessageArray[afterind]) == true){
				afterind++
				if (afterind == userMessageArray.length){
					endflag = true
					break
				}
			}
			
			// check if it is x.com
			if ((charInd + 4 < userMessageArray.length) && (userMessageArray.slice(charInd+1,charInd+5).join('') == '.com')) {
				twitter = true
			} else {
				twitter = false
			}

			//console.log("before:[",userMessageArray[beforeind],"]","\nafter:[",userMessageArray[afterind],"]", "\nendflag:",endflag)//debugging
			//then check for alphanumeric on both sides
			
			if ((beforeflag == true || isAlnum(userMessageArray[beforeind]) == false) && (endflag == true || isAlnum(userMessageArray[afterind]) == false) && !twitter){
				return "valid"
			}
		}
	}
	return "invalid"
}

//test if a character is alphanumeric in any language i think
function isAlnum(ch) {
	//exclude hypen
	if (ch.match("-") != null) return true
	//not really sure, just found it on the interwebs
	alphanumeric = /^[\p{L}\p{N}]*$/u
	//if it is not in this scope it will be null, therefore not alphanumeric
	if (ch.match(alphanumeric) != null){
		return true
	}
	else {
		return false
	}
}
