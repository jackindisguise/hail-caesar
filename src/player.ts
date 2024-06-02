import { Mob } from "./dungeon.js";
import { randomBytes, scryptSync } from "crypto";

export class Player {
	#mob?: Mob;
	#password?: string;
	#salt?: string;

	set password(password: string) {
		const salt = randomBytes(16);
		const hash = scryptSync(password, salt, 64);
		this.#password = hash.toString("hex");
		this.#salt = salt.toString("hex");
		// Buffer.from(this.#salt, "hex");
	}
}
