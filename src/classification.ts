interface ClassificationInterface {
	name: string;
	description: string;
}

export class Classification {
	name: string;
	description: string;
	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}

	static validateInterface(data: any): ClassificationInterface {
		if (typeof data !== "object")
			throw new TypeError("given non-object for validation");
		if (typeof data.name !== "string")
			throw new TypeError("missing/bad field for 'name'");
		if (typeof data.description !== "string")
			throw new TypeError("missing/bad field for 'description'");
		return {
			name: data.name,
			description: data.description,
		};
	}

	static fromJSON(data: any): Classification {
		// validate JSON
		const obj: ClassificationInterface = Classification.validateInterface(data);

		// load classification
		const c = new Classification(obj.name, obj.description);
		return c;
	}
}
