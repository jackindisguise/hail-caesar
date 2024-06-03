interface ClassificationInterface {
	name?: string;
	description?: string;
}

export class Classification {
	name?: string;
	description?: string;

	static validateInterface(data: unknown): ClassificationInterface | undefined {
		if (!data) return;
		if (typeof data !== "object") return;
		const obj: Record<string, unknown> = data as Record<string, unknown>;
		if (typeof obj.name !== "string") return;
		if (typeof obj.description !== "string") return;
		return obj as ClassificationInterface;
	}

	static fromJSON(data: unknown): Classification | undefined {
		// validate JSON
		const obj: ClassificationInterface | undefined =
			Classification.validateInterface(data);
		if (!obj) return;

		// load classification
		const c = new Classification();
		if (obj.name) c.name = obj.name;
		if (obj.description) c.description = obj.description;
		return c;
	}
}
