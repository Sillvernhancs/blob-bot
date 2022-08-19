const { Client, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs')
var kickMessageID = '';
var listOfActiveMembers = [];
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
	],
});
client.login(token);

client.on('ready', () => {
	// load the post from memory
	fs.readFile('kickMessageID.txt', (err, data) => {
		kickMessageID = data.toString();
		console.log('the message ID is: ', kickMessageID);
	});
	// load the users into a list.
	try {
		const data = fs.readFileSync('users.txt');
		listOfActiveMembers = data.toString().split('\n');
		listOfActiveMembers.pop();
		console.log(listOfActiveMembers);
	}
	catch (error) {
		console.log(error);
		console.log('error loading users');
	}
	console.log('the bot is ready');
});

client.on('messageCreate', message => {
	if (message.member.roles.cache.some(role => role.name === 'Server Owner') || message.member.roles.cache.some(role => role.name === 'officers')) {
		if (message.content === 'emote to this message to not get kicked lol [!]') {
			// update message ID to newest message id.
			fs.writeFileSync('kickMessageID.txt', message.id);
			kickMessageID = message.id;
			console.log('new message ID updated to: ' + kickMessageID);
		}
	}
});

client.on('messageReactionAdd', (reaction, user) => {
	if (reaction.message.id === kickMessageID && !listOfActiveMembers.includes(user.id.toString())) {
		// if the user is not in the active member's list
		listOfActiveMembers.push(user.id.toString());
		console.log('user added: ' + user.id.toString());
		const s = user.id.toString() + '\n';
		fs.appendFileSync('users.txt', s);
	}
});