import fcl from '@onflow/fcl';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
//TODO: handles all errors
dotenv.config();

fcl.config()
	.put('fcl.limit', 9999)
	.put('flow.network', process.env.FLOW_NETWORK)
	.put('accessNode.api', process.env.ACCESS_NODE_API)
	.put('0xBasicBeastsRaids', process.env.ADMIN_ADDRESS)
	.put('0xBasicBeastsNFTStaking', process.env.ADMIN_ADDRESS);

class flowService {
	static async getAddress(id) {
		console.log('Running getAddress');
		let script = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(discordID: String): Address? {
	let addresses = BasicBeastsRaids.getAddressToDiscords().keys
	for address in addresses {
		if(BasicBeastsRaids.getAddressFromDiscord(address: address)! == discordID) {
			return address
		}
	}
	return nil
}
        `;

		const address = await fcl.query({
			cadence: script,
			args: (arg, t) => [arg(id, t.String)],
		});

		return address;
	}

	static async userOptIn(address) {
		console.log('Running userOptIn');
		let script = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(address: Address): Bool {
    return BasicBeastsRaids.getPlayerOptIn(address: address) != nil
}
        `;

		const hasOptedIn = await fcl.query({
			cadence: script,
			args: (arg, t) => [arg(address, t.Address)],
		});

		return hasOptedIn;
	}

	static async canAttack(address) {
		console.log('Running canAttack');
		let script = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(address: Address): Bool {
    return BasicBeastsRaids.canAttack(attacker: address)
}
        `;

		const canAttack = await fcl.query({
			cadence: script,
			args: (arg, t) => [arg(address, t.Address)],
		});

		return canAttack;
	}

	static async nextAttack(address) {
		console.log('Running nextAttack');
		let script = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(address: Address): UFix64? {
    return BasicBeastsRaids.nextAttack(attacker: address)
}
        `;

		const canAttack = await fcl.query({
			cadence: script,
			args: (arg, t) => [arg(address, t.Address)],
		});

		return canAttack;
	}
}

export default flowService;
