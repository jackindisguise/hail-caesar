export class Dungeon {
	#width: number = 0;
	#height: number = 0;
	#layers: number = 0;
	#tiles: Tile[][][] = [];

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
				for (let x = 0; x < width; x++) row.push(new Tile());
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
						this.#tiles[z][y].push(new Tile());
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
					for (let x = 0; x < this.#width; x++) row.push(new Tile());
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
					for (let x = 0; x < this.#width; x++) row.push(new Tile());
				}
			}
		}
		this.#layers = layers;
	}
}

export class DungeonObject {
	keyword: string = "object";
	display: string = "an object";
	description: string = "It's an object.";
	location?: DungeonObject;
	contents: DungeonObject[] = [];
}

export class Tile extends DungeonObject {
	keyword = "tile";
	display = "Tile";
	description = "It's a tile.";
}

export class Movable extends DungeonObject {
	/*moveTo(object: DungeonObject) {
		this.location = object;
	}*/
}

export class Mob extends Movable {}
export class Obj extends Movable {}
export class Prop extends DungeonObject {}
