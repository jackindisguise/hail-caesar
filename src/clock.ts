import { EventEmitter } from "events";
import { t } from "./i18n.js";
import { Serializable } from "./serializable.js";

export interface ClockData {
	runtime: number;
}

export class Clock extends EventEmitter implements Serializable<ClockData> {
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

	static validateData(data: any): ClockData {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.runtime !== "number")
			throw new TypeError("missing/bad field 'runtime'");
		return {
			runtime: data.runtime,
		};
	}

	static fromData(data: any): Clock {
		// validate JSON
		const validated: ClockData = Clock.validateData(data);

		// load world
		const world = new Clock(validated.runtime);
		return world;
	}

	toData(): ClockData {
		return {
			runtime: this.runtime,
		};
	}
}
