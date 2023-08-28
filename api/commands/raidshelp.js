import flowService from '../services/flowService.js';

const raidshelp = {
	name: '!raidshelp',
	description: 'Handles the !raidshelp command',
	execute: async (message) => {
		const availableCommands = [
			{ icon: '⚔️', name: '!raid', description: 'raid random player' },
			{
				icon: '⌛️',
				name: '!raidslimit',
				description: 'view remaining raids',
			},
			{
				icon: '🎯',
				name: '!raid @bz',
				description: 'target a player by tagging @ or reply msg',
			},
			{ icon: '🌪️', name: '!leaveraid', description: 'leave the raid' },
		];

		const formattedCommands = availableCommands
			.map((cmd) => `${cmd.icon} \`${cmd.name}\` *${cmd.description}*`)
			.join('\n\n');

		const userImage = message.author.displayAvatarURL({
			format: 'png',
			dynamic: true,
			size: 128,
		});

		const embed = {
			color: 0x2ecc71,
			author: {
				name: `${message.author.username} requested help!🛡️`,
				icon_url: userImage,
			},
			title: 'Commands for raiding:',
			description: formattedCommands,
		};

		await message.reply({ embeds: [embed] });

		const address = await flowService.getAddress(message.author.id);
		const hasOptedIn = await flowService.userOptIn(address);
		if (!address || !hasOptedIn) {
			await message.reply(
				'Cannot raid, please connect discord and choose your beast at https://wonderland-chi.vercel.app/raids'
			);
			return;
		}
		await message.reply('try use the command `!raid` 🗡️');
	},
};

export default raidshelp;
