import { EventEmitter } from "events";
import { t } from "./i18n.js";

export interface ClockInterface {
	runtime: number;
}

export class Clock extends EventEmitter {
	/**
	 * The global runtime of the world.
	 */
	protected _runtime: number;

	/**
	 * When the world started this session.
	 */
	protected _start: number;
	constructor(runtime: number) {
		super();
		this._runtime = runtime;
		this._start = Date.now();
	}

	/**
	 * Gets the *current* runtime, which is the stored runtime and this session combined.
	 */
	get runtime() {
		return this._runtime + (Date.now() - this._start);
	}

	static validateInterface(data: any): ClockInterface {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.runtime !== "number")
			throw new TypeError("missing/bad field 'runtime'");
		return {
			runtime: data.runtime,
		};
	}

	static fromJSON(data: any): Clock {
		// validate JSON
		const wi: ClockInterface = Clock.validateInterface(data);

		// load world
		const w = new Clock(wi.runtime);
		return w;
	}

	toJSON(): ClockInterface {
		return {
			runtime: this.runtime,
		};
	}
}
