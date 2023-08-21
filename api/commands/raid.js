import flowService from '../services/flowService.js';

const raid = {
	name: '!raid',
	description: 'Handles the !raid command',
	execute: async (message) => {
		// raid logic here

		const address = await flowService.getAddress(message.author.id);
		if (address) {
			//check opt in
			const hasOptedIn = await flowService.userOptIn(address);
			if (hasOptedIn) {
				//check cooldown
				const canAttack = await flowService.canAttack(address);

				if (canAttack) {
					// check if has valid rewards with current beast
					const hasValidRewards = await flowService.hasValidRewards(
						address
					);
					if (hasValidRewards) {
						// run transaction
						await flowService.randomRaid(address, message);
					} else {
						message.reply(
							'Sorry, your beast no longer has any sushi or ice cream to raid.'
						);
					}
				} else {
					//check when next attack is possible
					const nextAttack = await flowService.nextAttack(address);
					message.reply(
						'Sorry, you can only raid 9 times a day (9 per Beast). You can raid again in ' +
							secondsToHms(86400.0 - nextAttack)
					);
				}
			} else {
				await message.reply(
					'You need to choose a beast first https://wonderland-chi.vercel.app/raids'
				);
			}
		} else {
			await message.reply(
				'Cannot raid, please link discord & choose beast at https://wonderland-chi.vercel.app/raids'
			);
		}
	},
};

function secondsToHms(seconds) {
	seconds = Math.floor(seconds); // Round down to the nearest second.

	let hours = Math.floor(seconds / 3600); // Calculate hours.
	seconds %= 3600;
	let minutes = Math.floor(seconds / 60); // Calculate minutes.
	let secs = seconds % 60; // Remaining seconds.

	// Convert to strings and pad with 0 if needed.
	let hoursStr = String(hours).padStart(2, '0');
	let minutesStr = String(minutes).padStart(2, '0');
	let secsStr = String(secs).padStart(2, '0');

	return `${hoursStr}:${minutesStr}:${secsStr}`;
}

export default raid;
