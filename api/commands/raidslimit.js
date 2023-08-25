import flowService from '../services/flowService.js';

const raidslimit = {
	name: '!raidslimit',
	description: 'Handles the !raid command',
	execute: async (message) => {
		try {
			// raidslimit logic here
			const address = await flowService.getAddress(message.author.id);

			if (address !== null && address !== undefined) {
				const hasOptedIn = await flowService.userOptIn(address);
				if (hasOptedIn) {
					const remainingRaids = await flowService.getRemainingRaids(
						address
					);

					if (remainingRaids > 0) {
						message.reply(
							`${message.author.toString()} has ${remainingRaids} raids left for the next 24 hours, go crazy`
						);
					} else {
						const nextRaidTime = await flowService.getNextRaidTime(
							address
						);

						if (nextRaidTime !== null) {
							const currentTime = Date.now(); // Current time in UTC milliseconds
							const timeRemaining = nextRaidTime - currentTime;

							if (timeRemaining > 0) {
								const secondsRemaining = Math.floor(
									timeRemaining / 1000
								);
								const hours = Math.floor(
									secondsRemaining / 3600
								);
								const minutes = Math.floor(
									(secondsRemaining % 3600) / 60
								);
								message.reply(
									`Next raid available in ${hours} hours and ${minutes} minutes.`
								);
							} else {
								message.reply(
									`Next raid is already available.`
								);
							}
						} else {
							message.reply(
								`Unable to determine the next raid time.`
							);
						}
					}
				} else {
					message.reply('You are not opted in for raids, please do');
				}
			} else {
				message.reply(
					'Your address info is not available. Make sure to buy a beast or please try to reconnect.'
				);
			}
		} catch (error) {
			message.reply(
				'An error occurred while processing your request. Please try again later.'
			);
		}
	},
};

export default raidslimit;
