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
	static encryptPrivateKey(key) {
		const secret = process.env.SECRET_PASSPHRASE;
		const encrypted = CryptoJS.AES.encrypt(key, secret).toString();
		return encrypted;
	}

	static decryptPrivateKey(encrypted) {
		const secret = process.env.SECRET_PASSPHRASE;
		const decrypted = CryptoJS.AES.decrypt(encrypted, secret).toString(
			CryptoJS.enc.Utf8
		);
		return decrypted;
	}

	static async getAdminAccountWithKeyIndex(keyIndex) {
		const FlowSigner = (await import('../utils/signer.mjs')).default;
		const key = this.decryptPrivateKey(
			process.env.ADMIN_ENCRYPTED_PRIVATE_KEY
		);

		const signer = new FlowSigner(
			process.env.ADMIN_ADDRESS,
			key,
			keyIndex,
			{}
		);
		return signer;
	}
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

	static async getDiscord(address) {
		console.log('Running getDiscord');
		let script = `
import BasicBeastsRaids from 0xBasicBeastsRaids

pub fun main(address: Address): String? {
	return BasicBeastsRaids.getAddressFromDiscord(address: address)
}
        `;

		const discord = await fcl.query({
			cadence: script,
			args: (arg, t) => [arg(address, t.Address)],
		});

		return discord;
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

	static AdminKeys = {
		120: false,
		121: false,
		112: false,
		113: false,
		114: false,
		115: false,
		116: false,
		117: false,
		118: false,
		119: false,
	};

	static async randomRaid(address, message) {
		let transaction = `
import BasicBeastsRaids from 0xBasicBeastsRaids

transaction(attacker: Address) {

	let gameMasterRef: &BasicBeastsRaids.GameMaster

	prepare(signer: AuthAccount) {
		self.gameMasterRef = signer.borrow<&BasicBeastsRaids.GameMaster>(from: BasicBeastsRaids.GameMasterStoragePath)!
	}

	execute {
		self.gameMasterRef.randomRaid(attacker: attacker)
	}
}
        `;
		let keyIndex = null;
		for (const [key, value] of Object.entries(this.AdminKeys)) {
			if (value == false) {
				keyIndex = parseInt(key);
				break;
			}
		}
		if (keyIndex == null) {
			message.reply('Server is busy, please try again later...');
			return;
		}

		console.log('keyIndex', keyIndex);
		this.AdminKeys[keyIndex] = true;
		const signer = await this.getAdminAccountWithKeyIndex(keyIndex);
		// message.reply('Raiding, please wait...');
		try {
			const txid = await signer.sendTransaction(transaction, (arg, t) => [
				arg(address, t.Address),
			]);

			if (txid) {
				let tx = await fcl.tx(txid).onceExecuted();
				let event = tx.events.find(
					(e) =>
						e.type ==
						'A.4c74cb420f4eaa84.BasicBeastsRaids.RaidEvent'
				);
				if (!event) {
					console.log('No raid');
					message.reply(
						'Something went wrong (1), please try again later...'
					);
					return;
				}
				console.log('Raid succeeded!', event.data);
				const defenderDiscordID = await this.getDiscord(
					event.data.defenderAddress
				);
				const prize =
					event.data.rewardTemplateID == 1 ? 'Sushi' : 'Ice Cream';
				if (defenderDiscordID && prize) {
					// if attacker wins
					if (event.data.attackerNFT == event.data.winner) {
						message.reply(
							`${message.author.toString()} has randomly raided <@${defenderDiscordID}> and stole 1 ${prize}`
						);
					}

					// if defender wins
					if (event.data.defenderNFT == event.data.winner) {
						message.reply(
							`${message.author.toString()} has randomly raided <@${defenderDiscordID}> and lost 1 ${prize}`
						);
					}

					// if burn
					if (
						event.data.defenderNFT != event.data.winner &&
						event.data.attackerNFT != event.data.winner
					) {
						message.reply(
							`${message.author.toString()} has randomly raided <@${defenderDiscordID}> but lost 1 ${prize} which got burned`
						);
					}
				} else {
					message.reply(
						'Something went wrong (2), please try again later...'
					);
				}

				// free up key
				await fcl.tx(txid).onceSealed();
				console.log('randomRaid sealed');
				this.AdminKeys[keyIndex] = false;
			}
		} catch (e) {
			this.AdminKeys[keyIndex] = false;
			console.log(e);
			message.reply(
				'Something went wrong (3), please try again later...'
			);
			return;
		}
	}
}

export default flowService;
