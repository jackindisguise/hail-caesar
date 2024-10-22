import { Mob, MobData } from "./dungeon.js";
import { randomBytes, scryptSync, randomUUID } from "crypto";
import { t } from "./i18n.js";
import { MUDClient } from "./io.js";
import { Serializable } from "./serializable.js";

export interface CharacterData {
	id?: string;
	hash?: string;
	salt?: string;
	mob?: MobData;
}

export interface CharacterOptions {
	id?: string;
	client?: MUDClient;
	password?: string;
	hash?: string;
	salt?: string;
	mob?: Mob;
}

/**
 * <p>Contains higher-level data about a character that is not directly related to the mob itself.</p>
 * <p>Generally speaking this includes the password, but also includes various configuration data.</p>
 */
export class Character implements Serializable<CharacterData> {
	protected id: string;
	protected hash?: string;
	protected salt?: string;
	protected _mob?: Mob;
	protected _client?: MUDClient;

	constructor(options?: CharacterOptions) {
		this.id = options && options.id ? options.id : randomUUID();
		if (!options) return;
		// if hash/salt is provided (loading from database?)
		if (options.hash && options.salt) {
			this.hash = options.hash;
			this.salt = options.salt;

			// if password is provided (creating a new one?)
		} else if (options.password) this.password = options.password;
		if (options.client) this.client = options.client;
	}

	set mob(mob: Mob) {
		this._mob = mob;
	}

	get mob(): Mob | undefined {
		return this._mob;
	}

	set client(client: MUDClient) {
		if (this._client === client) return;
		this._client = client;
		client.character = this;
	}

	get client(): MUDClient | undefined {
		return this._client;
	}

	set password(password: string) {
		const salt = randomBytes(16).toString("hex");
		const hash = scryptSync(password, salt, 32);
		this.hash = hash.toString("hex");
		this.salt = salt;
	}

	get password(): string | undefined {
		return this.hash;
	}

	check(password: string): boolean {
		if (!this.hash || !this.salt) return false;
		const hash = scryptSync(password, this.salt, 32);
		if (hash.toString("hex") !== this.hash) return false;
		return true;
	}

	toString() {
		if (this._mob)
			return t("<{{character}}>", {
				character: this._mob.toString(),
			});
		return t("<{{character}}>", {
			character: "!CHARACTER!",
		});
	}

	send(message: string) {
		this._client?.send(message);
	}

	sendLine(message: string) {
		this.send(`${message}\r\n`);
	}

	ask(question: string, callback: (command: string) => void) {
		this._client?.ask(question, callback);
	}

	yesno(question: string, callback: (agree: boolean) => void) {
		this._client?.yesno(question, callback);
	}

	static validateData(data: any): CharacterData {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.id !== "string")
			throw new TypeError("missing/bad field for 'id'");
		if (typeof data.hash !== "string")
			throw new TypeError("missing/bad field for 'hash'");
		if (typeof data.salt !== "string")
			throw new TypeError("missing/bad field for 'salt'");
		if (typeof data.mob !== "object")
			throw new TypeError("missing/bad field for 'mob'");
		return {
			id: data.id,
			hash: data.hash,
			salt: data.salt,
			mob: data.mob,
		};
	}

	static fromData(data: any): Character {
		// validate JSON
		const validated: CharacterData = Character.validateData(data);

		// convert data to valid options
		const options: CharacterOptions = {};
		if (validated.id) options.id = validated.id;
		if (validated.hash && validated.salt) {
			options.hash = validated.hash;
			options.salt = validated.salt;
		}

		// this is a big step
		if (validated.mob) options.mob = Mob.fromData(validated.mob);

		// create character
		const character = new Character(options);
		return character;
	}

	toData() {
		return {
			id: this.id,
			hash: this.hash,
			salt: this.salt,
			mob: this.mob?.toData(),
		};
	}
}
