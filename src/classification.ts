import {
	Attribute,
	Attributes,
	AttributeHelper,
	AttributeDefinitions,
} from "./attribute.js";

export interface ClassificationOptions {
	id: string;
	name: string;
	shortName: string;
	description: string;
	baseAttributes: Partial<Attributes>;
	levelModifiers: Partial<Attributes>;
}

/**
 * Base class for races and classes that provides attribute management
 */
export abstract class Classification {
	private readonly _id: string;
	private readonly _name: string;
	private readonly _shortName: string;
	private readonly _description: string;
	private readonly _baseAttributes: Partial<Attributes>;
	private readonly _levelModifiers: Partial<Attributes>;

	constructor(options: ClassificationOptions) {
		this._id = options.id;
		this._name = options.name;
		this._shortName = options.shortName;
		this._description = options.description;
		this._baseAttributes = { ...options.baseAttributes };
		this._levelModifiers = { ...options.levelModifiers };
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get shortName(): string {
		return this._shortName;
	}

	get description(): string {
		return this._description;
	}

	/**
	 * Get base attributes without level modifications
	 */
	get baseAttributes(): Partial<Attributes> {
		return { ...this._baseAttributes };
	}

	/**
	 * Get modifiers applied per level
	 */
	get levelModifiers(): Partial<Attributes> {
		return { ...this._levelModifiers };
	}

	/**
	 * Get complete base attributes with derived values calculated
	 */
	protected getBaseAttributes(): Attributes {
		const result: Attributes = {
			[Attribute.Strength]: this._baseAttributes[Attribute.Strength] ?? 0,
			[Attribute.Dexterity]: this._baseAttributes[Attribute.Dexterity] ?? 0,
			[Attribute.Constitution]:
				this._baseAttributes[Attribute.Constitution] ?? 0,
			[Attribute.Intelligence]:
				this._baseAttributes[Attribute.Intelligence] ?? 0,
			[Attribute.Wisdom]: this._baseAttributes[Attribute.Wisdom] ?? 0,
			[Attribute.Charisma]: this._baseAttributes[Attribute.Charisma] ?? 0,
			[Attribute.Health]: this._baseAttributes[Attribute.Health] ?? 0,
			[Attribute.Mana]: this._baseAttributes[Attribute.Mana] ?? 0,
			[Attribute.Energy]: this._baseAttributes[Attribute.Energy] ?? 0,
		};

		return result;
	}

	/**
	 * Calculate attributes for a given level
	 */
	getAttributesAtLevel(level: number): Attributes {
		const result = this.getBaseAttributes();

		// Apply level-based modifications
		if (level > 1) {
			for (const attr of Object.values(Attribute)) {
				if (this._levelModifiers[attr]) {
					result[attr] += Math.floor(
						(this._levelModifiers[attr] ?? 0) * (level - 1)
					);
				}
			}
		}

		return result;
	}

	/**
	 * Get a formatted string of all attributes at current level
	 */
	getAttributesSummary(level: number): string {
		const attrs = this.getAttributesAtLevel(level);
		return Object.values(Attribute)
			.map((attr) => AttributeHelper.formatAttributeValue(attr, attrs[attr]))
			.join(", ");
	}

	/**
	 * Get base attributes formatted with descriptions
	 */
	getBaseAttributesDescription(): string {
		const attrs = this.baseAttributes;
		return AttributeHelper.getAllBaseAttributes()
			.map((attr) => {
				const value = attrs[attr] ?? 0;
				const meta = AttributeDefinitions[attr];
				return `${meta.name} (${meta.shortName}): ${value}\n${meta.description}`;
			})
			.join("\n\n");
	}
}

/**
 * Represents a playable or NPC race
 */
export class Race extends Classification {
	constructor(options: ClassificationOptions) {
		super(options);
	}
}

/**
 * Represents a character class (profession)
 */
export class Class extends Classification {
	constructor(options: ClassificationOptions) {
		super(options);
	}
}
