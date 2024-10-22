import { Serializable } from "./serializable.js";

interface ClassificationData {
	name: string;
	description: string;
}

export class Classification implements Serializable<ClassificationData> {
	name: string;
	description: string;
	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}

	static validateData(data: any): ClassificationData {
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

	static fromData(data: any): Classification {
		// validate JSON
		const validated: ClassificationData = Classification.validateData(data);

		// load classification
		const classification = new Classification(
			validated.name,
			validated.description
		);
		return classification;
	}

	toData(): ClassificationData {
		return {
			name: this.name,
			description: this.description,
		};
	}
}
