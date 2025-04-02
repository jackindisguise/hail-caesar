import { Race, Class } from "./classification.js";

export type DungeonOptions = {
	name: string;
	description?: string;
	width: number;
	height: number;
	layers: number;
};

export type MapObjectOptions = {
	name: string;
	description?: string;
};

export type TileOptions = MapObjectOptions & {
	x: number;
	y: number;
	z: number;
};

export type MobOptions = MapObjectOptions & {
	race: Race;
	class: Class;
	level: number; // Current level of the mob
};

export type ObjectOptions = MapObjectOptions & {
	isPickupable?: boolean;
};

export type PropOptions = MapObjectOptions & {
	isInteractable?: boolean;
};

export type SignOptions = PropOptions & {
	text: string;
};

/**
 * A dungeon represents all the data about an area.
 */
export class Dungeon {
	name: string;
	description?: string;
	private tiles: Tile[][][] = [];
	private _width: number;
	private _height: number;
	private _layers: number;
	private _contents: MapObject[] = [];

	constructor(options: DungeonOptions) {
		this.name = options.name;
		this.description = options.description;
		this._width = options.width;
		this._height = options.height;
		this._layers = options.layers;

		// Initialize the 3D array of tiles
		for (let z = 0; z < this._layers; z++) {
			this.tiles[z] = [];
			for (let y = 0; y < this._height; y++) {
				this.tiles[z][y] = [];
				for (let x = 0; x < this._width; x++) {
					const tile = new Tile({
						name: `Tile(${x},${y},${z})`,
						x: x,
						y: y,
						z: z,
					});
					tile.map = this;
					this.tiles[z][y][x] = tile;
				}
			}
		}
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
		return [...this._contents];
	}

	getTile(x: number, y: number, z: number) {
		if (
			x < 0 ||
			x >= this._width ||
			y < 0 ||
			y >= this._height ||
			z < 0 ||
			z >= this._layers
		) {
			return undefined;
		}
		return this.tiles[z][y][x];
	}

	addObject(obj: MapObject) {
		if (!this._contents.includes(obj)) {
			this._contents.push(obj);
			(obj as any).setMap(this);
		}
	}

	removeObject(obj: MapObject) {
		const index = this._contents.indexOf(obj);
		if (index > -1) {
			this._contents.splice(index, 1);
			(obj as any).setMap(undefined);
		}
	}
}

/**
 * Base class for all objects that can exist on a tile
 */
export abstract class MapObject {
	protected _name: string;
	protected _description?: string;
	protected _map?: Dungeon;
	protected _location?: MapObject;
	protected _contents: MapObject[] = [];

	constructor(options: MapObjectOptions) {
		this._name = options.name;
		this._description = options.description;
	}

	get name() {
		return this._name;
	}

	get description() {
		return this._description;
	}

	get map() {
		return this._map;
	}

	set map(value: Dungeon | undefined) {
		this._map = value;
	}

	get location() {
		return this._location;
	}

	get x(): number | undefined {
		if (this._location instanceof Tile) {
			return this._location.x;
		}
		return this._location?.x;
	}

	get y(): number | undefined {
		if (this._location instanceof Tile) {
			return this._location.y;
		}
		return this._location?.y;
	}

	get z(): number | undefined {
		if (this._location instanceof Tile) {
			return this._location.z;
		}
		return this._location?.z;
	}

	protected setMap(map: Dungeon | undefined) {
		this._map = map;
	}

	protected setLocation(location: MapObject | undefined) {
		if (this._location) {
			this._location.remove(this);
		}
		this._location = location;
		if (location) {
			location.add(this);
		}
	}

	add(obj: MapObject) {
		if (!this._contents.includes(obj)) {
			this._contents.push(obj);
			(obj as any).setLocation(this);

			// If this object is part of a map, add the object to the map's contents
			if (this._map) {
				this._map.addObject(obj);
			}
		}
	}

	remove(obj: MapObject) {
		const index = this._contents.indexOf(obj);
		if (index > -1) {
			this._contents.splice(index, 1);
			(obj as any).setLocation(undefined);

			// If this object is part of a map, remove the object from the map's contents
			if (this._map) {
				this._map.removeObject(obj);
			}
		}
	}

	getContents(): MapObject[] {
		return [...this._contents];
	}

	getMovableObjects(): MovableObject[] {
		return this._contents.filter(
			(obj): obj is MovableObject => obj instanceof MovableObject
		);
	}

	getImmovableObjects(): ImmovableObject[] {
		return this._contents.filter(
			(obj): obj is ImmovableObject => obj instanceof ImmovableObject
		);
	}

	getMobs(): Mob[] {
		return this._contents.filter((obj): obj is Mob => obj instanceof Mob);
	}

	getItems(): Object[] {
		return this._contents.filter((obj): obj is Object => obj instanceof Object);
	}

	getProps(): Prop[] {
		return this._contents.filter((obj): obj is Prop => obj instanceof Prop);
	}

	getSigns(): Sign[] {
		return this._contents.filter((obj): obj is Sign => obj instanceof Sign);
	}
}

/**
 * Actual tiles that occupy space.
 */
export class Tile extends MapObject {
	private _x: number;
	private _y: number;
	private _z: number;

	constructor(options: TileOptions) {
		super(options);
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

/**
 * Represents movable objects like mobs and items
 */
export abstract class MovableObject extends MapObject {
	protected _isMovable: boolean = true;

	constructor(options: MapObjectOptions) {
		super(options);
	}

	get isMovable() {
		return this._isMovable;
	}
}

/**
 * Represents immovable objects like props and signs
 */
export abstract class ImmovableObject extends MapObject {
	protected _isMovable: boolean = false;

	constructor(options: MapObjectOptions) {
		super(options);
	}

	get isMovable() {
		return this._isMovable;
	}
}

/**
 * Represents a mob (monster, NPC, etc.)
 */
export class Mob extends MovableObject {
	private _currentHealth: number;
	private _currentMana: number;
	private _currentEnergy: number;
	private _race: Race;
	private _class: Class;
	private _level: number;

	constructor(options: MobOptions) {
		super(options);
		this._race = options.race;
		this._class = options.class;
		this._level = options.level;

		// Initialize current values to maximum values
		this._currentHealth = this.maxHealth;
		this._currentMana = this.maxMana;
		this._currentEnergy = this.maxEnergy;
	}

	get currentHealth() {
		return this._currentHealth;
	}

	get currentMana() {
		return this._currentMana;
	}

	get currentEnergy() {
		return this._currentEnergy;
	}

	get race(): Race {
		return this._race;
	}

	set race(value: Race) {
		this._race = value;
	}

	get class(): Class {
		return this._class;
	}

	set class(value: Class) {
		this._class = value;
	}

	get level() {
		return this._level;
	}

	// Maximum values are calculated from race, class, and level
	get maxHealth() {
		// TODO: Implement calculation based on race, class, and level attributes
		return 0;
	}

	get maxMana() {
		// TODO: Implement calculation based on race, class, and level attributes
		return 0;
	}

	get maxEnergy() {
		// TODO: Implement calculation based on race, class, and level attributes
		return 0;
	}

	set currentHealth(value: number) {
		this._currentHealth = Math.max(0, Math.min(value, this.maxHealth));
	}

	set currentMana(value: number) {
		this._currentMana = Math.max(0, Math.min(value, this.maxMana));
	}

	set currentEnergy(value: number) {
		this._currentEnergy = Math.max(0, Math.min(value, this.maxEnergy));
	}
}

/**
 * Represents a movable item or object
 */
export class Object extends MovableObject {
	private _isPickupable: boolean;

	constructor(options: ObjectOptions) {
		super(options);
		this._isPickupable = options.isPickupable ?? false;
	}

	get isPickupable() {
		return this._isPickupable;
	}
}

/**
 * Represents an immovable prop (furniture, decoration, etc.)
 */
export class Prop extends ImmovableObject {
	private _isInteractable: boolean;

	constructor(options: PropOptions) {
		super(options);
		this._isInteractable = options.isInteractable ?? false;
	}

	get isInteractable() {
		return this._isInteractable;
	}
}

/**
 * Represents a sign or text display
 */
export class Sign extends Prop {
	private _text: string;

	constructor(options: SignOptions) {
		super({ ...options, isInteractable: true }); // Signs are always interactable
		this._text = options.text;
	}

	get text() {
		return this._text;
	}
}
