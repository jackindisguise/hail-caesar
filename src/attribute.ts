export enum Attribute {
	// Base attributes
	Strength = "strength",
	Dexterity = "dexterity",
	Constitution = "constitution",
	Intelligence = "intelligence",
	Wisdom = "wisdom",
	Charisma = "charisma",
	// Derived attributes
	Health = "health",
	Mana = "mana",
	Energy = "energy",
}

export type Attributes = {
	[Attribute.Strength]: number;
	[Attribute.Dexterity]: number;
	[Attribute.Constitution]: number;
	[Attribute.Intelligence]: number;
	[Attribute.Wisdom]: number;
	[Attribute.Charisma]: number;
	// Derived attributes (can be modified independently)
	[Attribute.Health]: number;
	[Attribute.Mana]: number;
	[Attribute.Energy]: number;
};

export interface AttributeMetadata {
	name: string; // Full name
	shortName: string; // Abbreviated name
	description: string; // Description of what the attribute does
	category: "base" | "derived"; // Category of attribute
}

export const AttributeDefinitions: Record<Attribute, AttributeMetadata> = {
	[Attribute.Strength]: {
		name: "Strength",
		shortName: "STR",
		description:
			"Physical power and carrying capacity. Affects melee damage and ability to lift heavy objects.",
		category: "base",
	},
	[Attribute.Dexterity]: {
		name: "Dexterity",
		shortName: "DEX",
		description:
			"Agility, reflexes, and balance. Affects accuracy, dodge chance, and movement speed.",
		category: "base",
	},
	[Attribute.Constitution]: {
		name: "Constitution",
		shortName: "CON",
		description:
			"Physical toughness and stamina. Affects health points and resistance to physical effects.",
		category: "base",
	},
	[Attribute.Intelligence]: {
		name: "Intelligence",
		shortName: "INT",
		description:
			"Mental acuity and knowledge. Affects spell power and ability to learn new skills.",
		category: "base",
	},
	[Attribute.Wisdom]: {
		name: "Wisdom",
		shortName: "WIS",
		description:
			"Intuition and willpower. Affects mana regeneration and resistance to mental effects.",
		category: "base",
	},
	[Attribute.Charisma]: {
		name: "Charisma",
		shortName: "CHA",
		description:
			"Force of personality and leadership. Affects interaction with NPCs and ability to command allies.",
		category: "base",
	},
	[Attribute.Health]: {
		name: "Health Points",
		shortName: "HP",
		description:
			"Amount of damage that can be taken before death. Derived from Constitution.",
		category: "derived",
	},
	[Attribute.Mana]: {
		name: "Mana Points",
		shortName: "MP",
		description:
			"Magical energy available for casting spells. Derived from Constitution.",
		category: "derived",
	},
	[Attribute.Energy]: {
		name: "Energy Points",
		shortName: "EP",
		description:
			"Stamina available for physical abilities. Derived from Constitution.",
		category: "derived",
	},
} as const;

// Helper functions to work with attribute metadata
export class AttributeHelper {
	static getFullName(attr: Attribute): string {
		return AttributeDefinitions[attr].name;
	}

	static getShortName(attr: Attribute): string {
		return AttributeDefinitions[attr].shortName;
	}

	static getDescription(attr: Attribute): string {
		return AttributeDefinitions[attr].description;
	}

	static getCategory(attr: Attribute): "base" | "derived" {
		return AttributeDefinitions[attr].category;
	}

	static isBaseAttribute(attr: Attribute): boolean {
		return AttributeDefinitions[attr].category === "base";
	}

	static isDerivedAttribute(attr: Attribute): boolean {
		return AttributeDefinitions[attr].category === "derived";
	}

	static getAllBaseAttributes(): Attribute[] {
		return Object.entries(AttributeDefinitions)
			.filter(([_, meta]) => meta.category === "base")
			.map(([attr, _]) => attr as Attribute);
	}

	static getAllDerivedAttributes(): Attribute[] {
		return Object.entries(AttributeDefinitions)
			.filter(([_, meta]) => meta.category === "derived")
			.map(([attr, _]) => attr as Attribute);
	}

	static formatAttributeValue(attr: Attribute, value: number): string {
		return `${AttributeDefinitions[attr].shortName}: ${value}`;
	}
}
