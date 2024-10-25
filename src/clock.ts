import { EventEmitter } from "events";
import { t } from "i18next";
import { Serializable } from "./serializable.js";

export interface ClockData {
	time: number;
}

export class Clock extends EventEmitter implements Serializable<ClockData> {
	/**
	 * The global runtime of the world.
	 */
	protected _time: number;

	/**
	 * When the world started this session.
	 */
	protected _start: number;

	constructor(time: number) {
		super();
		this._time = time;
		this._start = Date.now();
	}

	/**
	 * Gets the *current* runtime, which is the stored runtime and this session combined.
	 */
	get time() {
		return this._time + (Date.now() - this._start);
	}

	static validateData(data: any): ClockData {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.time !== "number")
			throw new TypeError("missing/bad field 'runtime'");
		return {
			time: data.time,
		};
	}

	static fromData(data: any): Clock {
		// validate JSON
		const validated: ClockData = Clock.validateData(data);

		// load clock
		const clock = new Clock(validated.time);
		return clock;
	}

	toData(): ClockData {
		return {
			time: this.time,
		};
	}
}
