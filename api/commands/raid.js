import flowService from '../services/flowService.js';

const raid = {
	name: '!raid',
	description: 'Handles the !raid command',
	execute: async (message) => {
		// Your raid logic here
		// const address = await flowService.getAddress('854000040887582730');
		const testnetAddressMap = {
			'854000040887582730': '0x4742010dbfe107da',
		};
		const address = testnetAddressMap[message.author.id];
		if (address) {
			//check opt in
			//const hasOptedIn = await flowService.userOptIn(address);
			const hasOptedIn = true;
			//todo: temp message
			await message.reply('address found');
			if (hasOptedIn) {
				//check cooldown
				// const canAttack = await flowService.canAttack(address)
				const canAttack = true;
				if (canAttack) {
					// run transaction
					// message if backend is busy to try again later
					// message transaction is running
					// message outcome
				} else {
					//check when next attack is possible
					// const timestamp = 2.00
				}
				//todo: temp message
				await message.reply('player has opted in: ' + address);
			} else {
				//todo: temp message
				await message.reply('player has not opted in: ' + address);
			}
		} else {
			await message.reply(
				'Cannot raid, please setup your emerald id with blocto correctly https://id.ecdao.org/'
			);
		}
	},
};

export default raid;
