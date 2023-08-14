import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

client.on('ready', () => {
	console.log('Bot is online!');
});

client.on('messageCreate', (message) => {
	if (message.author.id !== '854000040887582730') return;
	if (message.channel.id !== '897100198738796555') return;

	// Check if the message content matches the command
	if (message.content === '!raid') {
		console.log('Raid command received!');
		message.reply('Raid command recognized!');
	}

	// console.log(
	// 	`Message received: Content: "${message.content}", Author: "${message.author.tag}", Channel: "${message.channel.name}"`
	// );
});

client.login(process.env.DISCORD_BOT_TOKEN);
