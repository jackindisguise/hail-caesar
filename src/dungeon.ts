export class Dungeon {
	#width: number = 0;
	#height: number = 0;
	#layers: number = 0;
	#tiles: Tile[][][] = [];
	#contents: DungeonObject[] = [];

	constructor(width: number, height: number, layers: number) {
		this.#setDimensions(width, height, layers);
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}

	get layers() {
		return this.#layers;
	}

	get contents() {
		return this.#contents;
	}

	add(...objects: DungeonObject[]) {
		for (let object of objects) {
			// add to contents only
			const pos = this.#contents.indexOf(object);
			if (pos === -1) this.#contents.push(object);

			// cyclical add here
			if (object.dungeon !== this) object.dungeon = this;
		}
	}

	remove(...objects: DungeonObject[]) {
		for (let object of objects) {
			// remove from contents only
			const pos = this.#contents.indexOf(object);
			if (pos === -1) continue;
			this.#contents.splice(pos, 1);

			// cyclical remove here
			if (object.dungeon === this) object.dungeon = undefined;
		}
	}

	getTile(x: number, y: number, z: number): Tile {
		if (
			x < 0 ||
			x >= this.#width ||
			y < 0 ||
			y >= this.#height ||
			z < 0 ||
			z >= this.#layers
		)
			throw new Error("invalid Dungeon tile bounds");
		return this.#tiles[z][y][x];
	}

	#setDimensions(width: number, height: number, layers: number) {
		this.#width = width;
		this.#height = height;
		this.#layers = layers;
		for (let z = 0; z < layers; z++) {
			let layer: Tile[][] = [];
			this.#tiles.push(layer);
			for (let y = 0; y < height; y++) {
				let row: Tile[] = [];
				layer.push(row);
				for (let x = 0; x < width; x++) row.push(new Tile(this));
			}
		}
	}

	resizeWidth(width: number) {
		// shrink
		if (width < this.#width)
			for (let z = 0; z < this.#layers; z++)
				for (let y = 0; y < this.#height; y++) this.#tiles[z][y].length = width;
		// expand
		else if (width > this.#width) {
			for (let z = 0; z < this.#layers; z++) {
				for (let y = 0; y < this.#height; y++) {
					for (let x = this.#width; x < width; x++)
						this.#tiles[z][y].push(new Tile(this));
				}
			}
		}
		this.#width = width;
	}

	resizeHeight(height: number) {
		// shrink
		if (height < this.#height)
			for (let z = 0; z < this.#layers; z++) this.#tiles[z].length = height;
		// expand
		else if (height > this.#height) {
			for (let z = 0; z < this.#layers; z++) {
				for (let y = this.#height; y < height; y++) {
					let row: Tile[] = [];
					this.#tiles[z].push(row);
					for (let x = 0; x < this.#width; x++) row.push(new Tile(this));
				}
			}
		}
		this.#height = height;
	}

	resizeLayers(layers: number) {
		// shrink
		if (layers < this.#layers) this.#tiles.length = layers;
		// expand
		else if (layers > this.#layers) {
			for (let z = this.#tiles.length; z < layers; z++) {
				let layer: Tile[][] = [];
				this.#tiles.push(layer);
				for (let y = 0; y < this.#height; y++) {
					let row: Tile[] = [];
					layer.push(row);
					for (let x = 0; x < this.#width; x++) row.push(new Tile(this));
				}
			}
		}
		this.#layers = layers;
	}

	contains(...objects: DungeonObject[]) {
		for (let object of objects)
			if (!this.#contents.includes(object)) return false;
		return true;
	}
}

export class DungeonObject {
	keyword: string = "object";
	display: string = "an object";
	description: string = "It's an object.";
	#dungeon?: Dungeon;
	#location?: DungeonObject;
	#contents: DungeonObject[] = [];
	constructor(dungeon?: Dungeon) {
		if (dungeon) this.dungeon = dungeon;
	}

	get dungeon() {
		return this.#dungeon;
	}

	set dungeon(dungeon: Dungeon | undefined) {
		if (dungeon === this.#dungeon) return; // same dungeon
		const oDungeon = this.#dungeon;
		this.#dungeon = undefined; // setup for remove() call
		if (oDungeon) oDungeon.remove(this);
		this.#dungeon = dungeon; // setup for add() call
		if (dungeon) dungeon.add(this);
	}

	get location() {
		return this.#location;
	}

	set location(location: DungeonObject | undefined) {
		if (location === this.#location) return; // same location
		const oLocation = this.#location;
		this.#location = undefined; // setup for remove() call
		if (oLocation) oLocation.remove(this);
		this.#location = location; // setup for add() call
		if (location) location.add(this);
	}

	add(...objects: DungeonObject[]) {
		for (let object of objects) {
			// add to contents exclusively
			const pos = this.#contents.indexOf(object);
			if (pos !== -1) continue; // ignore, already in our contents
			this.#contents.push(object);

			// cyclical add handled here
			if (object.location !== this) object.location = this;

			// cyclical dungeon assingment
			if (object.dungeon !== this.dungeon) object.dungeon = this.dungeon; // conform!
		}
	}

	remove(...objects: DungeonObject[]) {
		for (let object of objects) {
			// remove from contents exclusively
			const pos = this.#contents.indexOf(object);
			if (pos === -1) continue; // ignore, not in our contents
			this.#contents.splice(pos, 1); // remove from contents

			// cyclical removal handled here
			if (object.location !== this) continue; // not actively tracking us
			object.location = undefined; // set location to nowhere

			// cyclical dungeon assignment
			if (object.dungeon === this.dungeon) object.dungeon = undefined; // send into the ether
		}
	}

	contains(...objects: DungeonObject[]) {
		for (let object of objects)
			if (!this.#contents.includes(object)) return false;
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
