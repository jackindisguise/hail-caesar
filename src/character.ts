import { Mob } from "./dungeon.js";
import { randomBytes, scryptSync } from "crypto";

/**
 * <p>Contains higher-level data about a character that is not directly related to the mob itself.</p>
 * <p>Generally speaking this includes the password, but also includes various configuration data.</p>
 */
export class Character {
	#hash?: string;
	#salt?: string;
	#mob?: Mob;
	constructor(mob?: Mob) {
		if (mob) this.mob = mob;
	}

	set mob(mob: Mob) {
		this.#mob = mob;
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
}
