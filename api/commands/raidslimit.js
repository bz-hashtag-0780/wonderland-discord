import flowService from '../services/flowService.js';

const raidslimit = {
	name: '!raidslimit',
	description: 'Handles the !raid command',
	execute: async (message) => {
		// raid logic here
		message.reply('22');
	},
};

export default raidslimit;
