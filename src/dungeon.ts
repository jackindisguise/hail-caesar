import { Serializable } from "./serializable.js";

interface DungeonOptions {
	width: number;
	height: number;
	layers: number;
}

export class Dungeon {
	protected _width: number = 0;
	protected _height: number = 0;
	protected _layers: number = 0;
	protected _tiles: Tile[][][] = [];
	protected _contents: DungeonObject[] = [];

	constructor(options: DungeonOptions) {
		this._setDimensions(options.width, options.height, options.layers);
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

	get contents() {
		return this._contents;
	}

	add(...objects: DungeonObject[]) {
		for (let object of objects) {
			// add to contents only
			const pos = this._contents.indexOf(object);
			if (pos === -1) this._contents.push(object);

			// cyclical add here
			if (object.dungeon !== this) object.dungeon = this;
		}
	}

	remove(...objects: DungeonObject[]) {
		for (let object of objects) {
			// remove from contents only
			const pos = this._contents.indexOf(object);
			if (pos === -1) continue;
			this._contents.splice(pos, 1);

			// cyclical remove here
			if (object.dungeon === this) object.dungeon = undefined;
		}
	}

	getTile(x: number, y: number, z: number): Tile {
		if (
			x < 0 ||
			x >= this._width ||
			y < 0 ||
			y >= this._height ||
			z < 0 ||
			z >= this._layers
		)
			throw new Error("invalid Dungeon tile bounds");
		return this._tiles[z][y][x];
	}

	protected _setDimensions(width: number, height: number, layers: number) {
		this._width = width;
		this._height = height;
		this._layers = layers;
		for (let z = 0; z < layers; z++) {
			let layer: Tile[][] = [];
			this._tiles.push(layer);
			for (let y = 0; y < height; y++) {
				let row: Tile[] = [];
				layer.push(row);
				for (let x = 0; x < width; x++)
					row.push(new Tile({ dungeon: this, x: x, y: y, z: z }));
			}
		}
	}

	resizeWidth(width: number) {
		// shrink
		if (width < this._width)
			for (let z = 0; z < this._layers; z++)
				for (let y = 0; y < this._height; y++) this._tiles[z][y].length = width;
		// expand
		else if (width > this._width) {
			for (let z = 0; z < this._layers; z++) {
				for (let y = 0; y < this._height; y++) {
					for (let x = this._width; x < width; x++)
						this._tiles[z][y].push(
							new Tile({ dungeon: this, x: x, y: y, z: z })
						);
				}
			}
		}
		this._width = width;
	}

	resizeHeight(height: number) {
		// shrink
		if (height < this._height)
			for (let z = 0; z < this._layers; z++) this._tiles[z].length = height;
		// expand
		else if (height > this._height) {
			for (let z = 0; z < this._layers; z++) {
				for (let y = this._height; y < height; y++) {
					let row: Tile[] = [];
					this._tiles[z].push(row);
					for (let x = 0; x < this._width; x++)
						row.push(new Tile({ dungeon: this, x: x, y: y, z: z }));
				}
			}
		}
		this._height = height;
	}

	resizeLayers(layers: number) {
		// shrink
		if (layers < this._layers) this._tiles.length = layers;
		// expand
		else if (layers > this._layers) {
			for (let z = this._tiles.length; z < layers; z++) {
				let layer: Tile[][] = [];
				this._tiles.push(layer);
				for (let y = 0; y < this._height; y++) {
					let row: Tile[] = [];
					layer.push(row);
					for (let x = 0; x < this._width; x++)
						row.push(new Tile({ dungeon: this, x: x, y: y, z: z }));
				}
			}
		}
		this._layers = layers;
	}

	contains(...objects: DungeonObject[]) {
		for (let object of objects)
			if (!this._contents.includes(object)) return false;
		return true;
	}
}

interface DungeonObjectOptions {
	dungeon?: Dungeon;
	keyword?: string;
	display?: string;
	description?: string;
}

export interface DungeonObjectData {
	keyword?: string;
	display?: string;
	description?: string;
	contents?: DungeonObjectData[];
}

export class DungeonObject implements Serializable<DungeonObjectData> {
	keyword: string = "dungeon object";
	display: string = "dungeon object";
	description: string = "It's a dungeon object!";
	protected _dungeon?: Dungeon;
	protected _location?: DungeonObject;
	protected _contents: DungeonObject[] = [];
	constructor(options?: DungeonObjectOptions) {
		if (!options) return;
		if (options.dungeon) this.dungeon = options.dungeon;
		if (options.keyword) this.keyword = options.keyword;
		if (options.display) this.display = options.display;
		if (options.description) this.description = options.description;
	}

	get dungeon() {
		return this._dungeon;
	}

	set dungeon(dungeon: Dungeon | undefined) {
		if (dungeon === this._dungeon) return; // same dungeon
		const oDungeon = this._dungeon;
		this._dungeon = undefined; // setup for remove() call
		if (oDungeon) oDungeon.remove(this);
		this._dungeon = dungeon; // setup for add() call
		if (dungeon) dungeon.add(this);
	}

	get name() {
		return this.display;
	}

	set name(name: string) {
		this.keyword = name;
		this.display = name;
	}

	toString() {
		return this.name;
	}

	get location() {
		return this._location;
	}

	set location(location: DungeonObject | undefined) {
		if (location === this._location) return; // same location
		const oLocation = this._location;
		this._location = undefined; // setup for remove() call
		if (oLocation) oLocation.remove(this);
		this._location = location; // setup for add() call
		if (location) location.add(this);
	}

	add(...objects: DungeonObject[]) {
		for (let object of objects) {
			// add to contents exclusively
			const pos = this._contents.indexOf(object);
			if (pos !== -1) continue; // ignore, already in our contents
			this._contents.push(object);

			// cyclical add handled here
			if (object.location !== this) object.location = this;

			// cyclical dungeon assingment
			if (object.dungeon !== this.dungeon) object.dungeon = this.dungeon; // conform!
		}
	}

	remove(...objects: DungeonObject[]) {
		for (let object of objects) {
			// remove from contents exclusively
			const pos = this._contents.indexOf(object);
			if (pos === -1) continue; // ignore, not in our contents
			this._contents.splice(pos, 1); // remove from contents

			// cyclical removal handled here
			if (object.location !== this) continue; // not actively tracking us
			object.location = undefined; // set location to nowhere

			// cyclical dungeon assignment
			if (object.dungeon === this.dungeon) object.dungeon = undefined; // send into the ether
		}
	}

	contains(...objects: DungeonObject[]) {
		for (let object of objects)
			if (!this._contents.includes(object)) return false;
		return true;
	}

	static validateData(data: any): DungeonObjectData {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.keyword !== "string")
			throw new TypeError("missing/bad field for 'keyword'");
		if (typeof data.display !== "string")
			throw new TypeError("missing/bad field for 'display'");
		if (typeof data.description !== "string")
			throw new TypeError("missing/bad field for 'description'");
		if (Array.isArray(data.contents) !== true)
			throw new TypeError("missing/bad field for 'contents'");
		return {
			keyword: data.keyword,
			display: data.display,
			description: data.description,
		};
	}

	static fromData(data: any): DungeonObject {
		// validate JSON
		const validated: DungeonObjectData = DungeonObject.validateData(data);

		// load character
		const character = new DungeonObject(validated);
		return character;
	}

	toData() {
		const result: DungeonObjectData = {
			keyword: this.keyword,
			display: this.display,
			description: this.description,
		};

		// check for contents
		if (this._contents.length) {
			const contents: DungeonObjectData[] = [];
			for (let obj of this._contents) contents.push(obj.toData());
			result.contents = contents;
		}

		// return result
		return result;
	}
}

interface TileOptions extends DungeonObjectOptions {
	x: number;
	y: number;
	z: number;
}

export class Tile extends DungeonObject {
	keyword = "tile";
	display = "Tile";
	description = "It's a tile!";
	x: number;
	y: number;
	z: number;
	constructor(options: TileOptions) {
		super(options);
		this.x = options.x;
		this.y = options.y;
		this.z = options.z;
	}
}

interface MovableOptions extends DungeonObjectOptions {
	location?: DungeonObject;
}

interface MovableInterface extends DungeonObjectData {
	loc?: number[];
}

export class Movable
	extends DungeonObject
	implements Serializable<MovableInterface>
{
	keyword = "movable";
	display = "movable";
	description = "It's a movable dungeon object!";
	get x(): number | undefined {
		if (this.location instanceof Tile) return this.location.x;
	}

	get y(): number | undefined {
		if (this.location instanceof Tile) return this.location.y;
	}

	get z(): number | undefined {
		if (this.location instanceof Tile) return this.location.z;
	}

	constructor(options?: MovableOptions) {
		super(options);
		if (options) {
			if (options.location) this.moveTo(options.location);
		}
	}

	moveTo(object: DungeonObject) {
		this.location = object;
	}

	toData() {
		return {
			...super.toData(),
			loc: [this.x || 0, this.y || 0, this.z || 0],
		};
	}
}

export interface MobData extends MovableInterface {}

export class Mob extends Movable implements Serializable<MobData> {
	keyword = "mob";
	display = "a mob";
	description = "It's a mob!";
	static fromData(data: any): Mob {
		// validate JSON
		const validated: DungeonObjectData = DungeonObject.validateData(data);

		// load mob
		const mob = new Mob(validated);
		return mob;
	}
}
export class Obj extends Movable {}
export class Prop extends DungeonObject {}
