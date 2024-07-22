export interface WorldInterface {
	name: string;
	port: number;
}

export class World {
	name: string;
	port: number;
	constructor(name: string, port: number) {
		this.name = name;
		this.port = port;
	}

	static validateInterface(data: any): WorldInterface {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.name !== "string")
			throw new TypeError("missing/bad field 'name'");
		if (typeof data.port !== "number")
			throw new TypeError("missing/bad field 'port'");
		return {
			name: data.name,
			port: data.port,
		};
	}

	static fromJSON(data: any): World {
		// validate JSON
		const wi: WorldInterface = World.validateInterface(data);

		// load world
		const w = new World(wi.name, wi.port);
		return w;
	}

	toJSON(): WorldInterface {
		return {
			name: this.name,
			port: this.port,
		};
	}
}
