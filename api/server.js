import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import raid from './commands/raid.js';
import express from 'express';
import raidslimit from './commands/raidslimit.js';

dotenv.config();

/** Express stuff */

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
	res.send('Discord bot is online!');
});

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});

/** Discord bot stuff */

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

const commands = new Map(); // Create a Map to store the commands
commands.set(raid.name, raid); // Register the raid command
commands.set(raidslimit.name, raidslimit);

client.on('ready', () => {
	console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
	// if (message.author.id !== '854000040887582730') return;
	if (message.channel.id !== '897100198738796555') return;

	const args = message.content.trim().split(/ +/g);
	const commandName = args.shift().toLowerCase(); // Extracting the command name

	let targetUser = null;

	// Check if the message is a reply to another user
	if (message.reference && message.reference.messageId) {
		try {
			const repliedMessage = await message.channel.messages.fetch(
				message.reference.messageId
			);
			targetUser = repliedMessage.author;
		} catch (err) {
			console.error('Failed to fetch the replied message:', err);
		}
	}
	// If not a reply, check if there's a direct mention
	else if (message.mentions.users.size > 0) {
		targetUser = message.mentions.users.first();
	}

	if (targetUser && targetUser.id === message.author.id) {
		await message.reply("You can't raid yourself!");
		return;
	}

	// Check if the command exists in our command Map
	if (commands.has(commandName)) {
		try {
			commands.get(commandName).execute(message, args, targetUser);
		} catch (error) {
			console.error('Error executing command:', error);
			await message.reply(
				'There was an error trying to execute that command!'
			);
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
