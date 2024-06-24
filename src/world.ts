import { EventEmitter } from "events";
import { setAbsoluteInterval, clearCustomInterval } from "./time.js";
import { logger } from "./winston.js";
import { _ } from "./i18n.js";

export interface WorldInterface {
	name: string;
	runtime: number;
}

export class World extends EventEmitter {
	/**
	 * The world name.
	 */
	name: string;

	/**
	 * The global runtime of the world.
	 */
	protected _runtime: number;

	/**
	 * When the world started this session.
	 */
	protected _start: number;
	constructor(name: string, runtime: number) {
		super();
		this.name = name;
		this._runtime = runtime;
		this._start = Date.now();
	}

	/**
	 * Gets the *current* runtime, which is the stored runtime and this session combined.
	 */
	get runtime() {
		return this._runtime + (Date.now() - this._start);
	}

	static validateInterface(data: any): WorldInterface {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.name !== "string")
			throw new TypeError("missing/bad field 'name'");
		if (typeof data.runtime !== "number")
			throw new TypeError("missing/bad field 'runtime'");
		return {
			name: data.name,
			runtime: data.runtime,
		};
	}

	static fromJSON(data: any): World {
		// validate JSON
		const wi: WorldInterface = World.validateInterface(data);

		// load world
		const w = new World(wi.name, wi.runtime);
		return w;
	}

	toJSON(): WorldInterface {
		return {
			name: this.name,
			runtime: this.runtime,
		};
	}
}
