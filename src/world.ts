import { EventEmitter } from "events";
import { setAbsoluteInterval } from "./time.js";

export interface WorldInterface {
	name: string;
	runtime: number;
	pulseTime: number;
	violencePulse: number;
	tickPulse: number;
}

export class World extends EventEmitter {
	/**
	 * The world name.
	 */
	name: string;

	/**
	 * The global runtime of the world.
	 */
	#runtime: number;

	pulseTime: number;
	violencePulse: number;
	tickPulse: number;

	/**
	 * When the world started this session.
	 */
	#start: number;
	constructor(
		name: string,
		runtime: number,
		pulseTime: number,
		violencePulse: number,
		tickPulse: number
	) {
		super();
		this.name = name;
		this.#runtime = runtime;
		this.#start = Date.now();
		this.pulseTime = pulseTime;
		this.violencePulse = violencePulse;
		this.tickPulse = tickPulse;

		// pulse management
		let pulses = 0;
		setAbsoluteInterval(() => {
			pulses++;
			if (pulses % violencePulse === 0) this.emit("violence");
			if (pulses % tickPulse === 0) this.emit("tick");
		}, pulseTime);
	}

	/**
	 * Gets the *current* runtime, which is the stored runtime and this session combined.
	 */
	get runtime() {
		return this.#runtime + (Date.now() - this.#start);
	}

	static validateInterface(data: any): WorldInterface {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.name !== "string")
			throw new TypeError("missing/bad field 'name'");
		if (typeof data.runtime !== "number")
			throw new TypeError("missing/bad field 'runtime'");
		if (typeof data.pulseTime !== "number")
			throw new TypeError("missing/bad field 'pulseTime'");
		if (typeof data.violencePulse !== "number")
			throw new TypeError("missing/bad field 'violencePulse'");
		if (typeof data.tickPulse !== "number")
			throw new TypeError("missing/bad field 'tickPulse'");

		return {
			name: data.name,
			runtime: data.runtime,
			pulseTime: data.pulseTime,
			violencePulse: data.violencePulse,
			tickPulse: data.tickPulse,
		};
	}

	static fromJSON(data: any): World {
		// validate JSON
		const wi: WorldInterface = World.validateInterface(data);

		// load world
		const w = new World(
			wi.name,
			wi.runtime,
			wi.pulseTime,
			wi.violencePulse,
			wi.tickPulse
		);
		return w;
	}

	toJSON(): WorldInterface {
		return {
			name: this.name,
			runtime: this.runtime,
			pulseTime: this.pulseTime,
			violencePulse: this.violencePulse,
			tickPulse: this.tickPulse,
		};
	}
}
