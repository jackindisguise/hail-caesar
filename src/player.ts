import { Mob } from "./dungeon.js";
import { randomBytes, scryptSync } from "crypto";

export class Player {
	#id?: number;
	#hash?: string;
	#salt?: string;

	set id(id: number) {
		if (this.#id === undefined) this.#id = id;
	}

	set password(password: string) {
		const salt = randomBytes(16);
		const hash = scryptSync(password, salt, 64);
		this.#hash = hash.toString("hex");
		this.#salt = salt.toString("hex");
	}

	get password(): string | undefined {
		return this.#hash;
	}

	check(password: string): boolean {
		if (!this.#hash || !this.#salt) return false;
		const buf = Buffer.from(this.#salt, "hex");
		const hash = scryptSync(password, buf, 64);
		if (hash.toString("hex") !== this.#hash) return false;
		return true;
	}

	toJSON() {
		return {
			hash: this.#hash,
			salt: this.#salt,
		};
	}
}
