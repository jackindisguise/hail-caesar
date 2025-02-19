export type DungeonOptions = {
	name: string;
	description?: string;
};

export type DungeonMapOptions = {
	width: number;
	height: number;
	layers: number;
};

export type TileOptions = {
	x: number;
	y: number;
	z: number;
};

/**
 * A dungeon represents all the data about an area.
 */
export class Dungeon {
	name: string;
	description?: string;
	private map?: DungeonMap;
	constructor(options: DungeonOptions) {
		this.name = options.name;
		this.description = options.description;
	}
}

/**
 * Represents the map of a Dungeon.
 */
export class DungeonMap {
	private tiles: Tile[][][] = [];
	private _width: number;
	private _height: number;
	private _layers: number;
	constructor(options: DungeonMapOptions) {
		this._width = options.width;
		this._height = options.height;
		this._layers = options.layers;
	}
	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get layers() {
		return this._layers;
	}

	getTile(x: number, y: number, z: number) {
		return this.tiles[z][y][x];
	}
}

/**
 * Actual tiles that occupy space.
 */
export class Tile {
	private _x: number;
	private _y: number;
	private _z: number;
	constructor(options: TileOptions) {
		if (!options) throw Error(`must provide location parameters for new tile`);
		if (typeof options.x !== "number")
			throw Error(`invalid x provided ('${options.x}')`);
		if (typeof options.y !== "number")
			throw Error(`invalid y provided ('${options.y}')`);
		if (typeof options.z !== "number")
			throw Error(`invalid z provided ('${options.z}')`);

		this._x = options.x;
		this._y = options.y;
		this._z = options.z;
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}

	get z() {
		return this._z;
	}
}
