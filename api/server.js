import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { raid } from './commands/raid.js'; // Import the raid command
import express from 'express';
import flowService from './services/flowService.js';

dotenv.config();

/** Express stuff */

const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
	res.send('Discord bot is online!');
});

app.listen(PORT, async () => {
	console.log(`Server is running on http://localhost:${PORT}`);
	const address = await flowService.getAddress('854000040887582730');
	console.log('flow address:', address);
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

client.on('ready', () => {
	console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
	if (message.author.id !== '854000040887582730') return;
	if (message.channel.id !== '897100198738796555') return;

	const args = message.content.trim().split(/ +/g);
	const commandName = args.shift().toLowerCase(); // Extracting the command name

	// Check if the command exists in our command Map
	if (commands.has(commandName)) {
		try {
			commands.get(commandName).execute(message, args);
		} catch (error) {
			console.error('Error executing command:', error);
			await message.reply(
				'There was an error trying to execute that command!'
			);
		}
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
