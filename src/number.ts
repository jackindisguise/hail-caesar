/**
 * Linear interpolation!
 * @param low The low end of the value.
 * @param high The high end of the value.
 * @param mod The amount of interpolation between the low and high end.
 * @returns {number} The interpolated value.
 */
export function lerp(low: number, high: number, mod: number): number {
	return low + (high - low) * mod;
}

/**
 * Generates a random integer between 2 numbers inclusively.
 * @param low The low end of the random integer.
 * @param high The high end of the random integer.
 * @returns
 */
export function randomInt(low: number, high: number): number {
	return Math.floor(lerp(low, high + 1, Math.random()));
}

/**
 * Simulates a dice roll.
 * @param die The number of die to roll.
 * @param sides The number of sides on each die.
 * @param mod? A modifier for the final value.
 * @returns {number} The result of the dice roll.
 */
export function roll(die: number, sides: number, mod?: number) {
	if (mod) return randomInt(die, die * sides) + mod;
	return randomInt(die, die * sides);
}

/**
 * Returns the result of each simulated die being rolled.
 * @param die The number of die to roll.
 * @param sides The number of sides on each die.
 * @returns {number[]} The result of the rolls.
 */
export function actualRoll(die: number, sides: number) {
	const results: number[] = [];
	for (let i = 0; i < die; i++) results.push(randomInt(1, sides));
	return results;
}
