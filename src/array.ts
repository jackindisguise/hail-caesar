import { randomInt } from "./number.js";

/**
 * Pick an element from a set of options.
 * @param options
 * @returns
 */
export function pick<type>(...options: type[]): type {
	return options[randomInt(0, options.length - 1)];
}

/**
 * Replace elements in an array based on on a rule.
 * @param array
 * @param rule
 * @param replace
 * @returns
 */
export function replace<type>(
	array: type[],
	rule: RegExp | type,
	replace: type
): type[] {
	const replaced: type[] = [];
	array.forEach((value, index) => {
		if (value === rule) replaced[index] = replace;
		else if (
			rule instanceof RegExp &&
			typeof value === "string" &&
			rule.exec(value)
		)
			replaced[index] = replace;
		else replaced[index] = value;
	});

	return replaced;
}
