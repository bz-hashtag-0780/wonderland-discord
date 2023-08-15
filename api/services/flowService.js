import fcl from '@onflow/fcl';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

fcl.config()
	.put('fcl.limit', 9999)
	.put('flow.network', process.env.FLOW_NETWORK)
	.put('accessNode.api', process.env.ACCESS_NODE_API)
	.put('0xEmeraldIdentity', '0x39e42c67cc851cfb')
	.put('0xBasicBeastsRaids', process.env.ADMIN_ADDRESS)
	.put('0xBasicBeastsNFTStaking', process.env.ADMIN_ADDRESS);

class flowService {
	static async getAddress(id) {
		let script = `
import EmeraldIdentity from 0xEmeraldIdentity

pub fun main(id: String): Address? {
    return EmeraldIdentity.getAccountFromDiscord(discordID: id)
}
        `;

		const address = await fcl.query({
			cadence: script,
			args: (arg, t) => [arg(id, t.String)],
		});

		return address;
	}

	static async userOptIn(address) {
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
}

export default flowService;
