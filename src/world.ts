export interface WorldInterface {
	name: string;
	runtime: number;
}

export class World {
	name: string;
	#runtime: number;
	#start: number;
	constructor(name: string, runtime: number) {
		this.name = name;
		this.#runtime = runtime;
		this.#start = Date.now();
	}

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
