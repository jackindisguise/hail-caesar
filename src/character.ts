import { Mob } from "./dungeon.js";
import { randomBytes, scryptSync } from "crypto";
import { t } from "./i18n.js";
import { MUDClient } from "./io.js";

/**
 * <p>Contains higher-level data about a character that is not directly related to the mob itself.</p>
 * <p>Generally speaking this includes the password, but also includes various configuration data.</p>
 */
export class Character {
	protected hash?: string;
	protected salt?: string;
	protected _mob?: Mob;
	protected _client?: MUDClient;

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
		const salt = randomBytes(16);
		const hash = scryptSync(password, salt, 64);
		this.hash = hash.toString("hex");
		this.salt = salt.toString("hex");
	}

	get password(): string | undefined {
		return this.hash;
	}

	check(password: string): boolean {
		if (!this.hash || !this.salt) return false;
		const buf = Buffer.from(this.salt, "hex");
		const hash = scryptSync(password, buf, 64);
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
}
