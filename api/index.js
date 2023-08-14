const { Client, Intents } = require('discord.js');
require('dotenv').config();

const myIntents = new Intents([
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
]);

const client = new Client({ intents: myIntents });

client.once('ready', () => {
	console.log('Bot is online!');
});

client.on('messageCreate', (message) => {
	if (message.author.id !== '854000040887582730') return;

	// Check if the message content matches the command
	if (message.content === '!raid') {
		console.log('Raid command received!');
		message.reply('Raid command recognized!');
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
