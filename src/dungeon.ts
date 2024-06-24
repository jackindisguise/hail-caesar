export class Dungeon {
	protected _width: number = 0;
	protected _height: number = 0;
	protected _layers: number = 0;
	protected _tiles: Tile[][][] = [];
	protected _contents: DungeonObject[] = [];

	constructor(width: number, height: number, layers: number) {
		this._setDimensions(width, height, layers);
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
				for (let x = 0; x < width; x++) row.push(new Tile(this));
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
						this._tiles[z][y].push(new Tile(this));
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
					for (let x = 0; x < this._width; x++) row.push(new Tile(this));
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
					for (let x = 0; x < this._width; x++) row.push(new Tile(this));
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

export class DungeonObject {
	keyword: string = "object";
	display: string = "an object";
	description: string = "It's an object.";
	protected _dungeon?: Dungeon;
	protected _location?: DungeonObject;
	protected _contents: DungeonObject[] = [];
	constructor(dungeon?: Dungeon) {
		if (dungeon) this.dungeon = dungeon;
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
}

export class Tile extends DungeonObject {
	keyword = "tile";
	display = "Tile";
	description = "It's a tile.";
}

export class Movable extends DungeonObject {
	constructor(object?: DungeonObject) {
		super();
		if (object) this.moveTo(object);
	}

	moveTo(object: DungeonObject) {
		this.location = object;
	}
}

export class Mob extends Movable {}
export class Obj extends Movable {}
export class Prop extends DungeonObject {}
