/**
 * Returns a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * I wrote unit tests to insure this range is 0-1 inclusive using the algorithm I wrote.
 * The higher the range, the more impossible it becomes to actually land on 0 or 1.
 * I don't even know how many iterations I'd need to run to get a 0 AND a 1 with Number.MAX_VALUE.
 * Even 99m values is too high to get a 0 AND a 1 in 1m iterations.
 */
const RANDOM_INT_LOW = 0;
const RANDOM_INT_HIGH = 9999999;

/**
 * Uses randomInt (which is inclusive) to generate an integer in the specified range.
 * This should produce a respectable distribution of potential values.
 * And it should be inclusive.
 * @returns
 */
export function random(): number {
	const result = randomInt(RANDOM_INT_LOW, RANDOM_INT_HIGH);
	return lerp(0, 1, result / RANDOM_INT_HIGH);
}

/**
 * Rolls a number of dice with the given number of sides
 * @param sides Number of sides on each die
 * @param count Number of dice to roll (default: 1)
 * @returns Array of individual roll results and their sum
 */
export function rollDice(sides: number, count: number = 1): number {
	return randomInt(count, sides * count);
}

/**
 * Rolls dice multiple times and keeps all results
 * @param sides Number of sides on each die
 * @param diceCount Number of dice to roll each time
 * @param rollCount Number of times to roll the dice
 * @returns Array of roll results, each containing individual rolls and their sum
 */
export function rollAndKeep(
	sides: number,
	diceCount: number = 1,
	rollCount: number = 1
): {
	rolls: number[];
	total: number;
} {
	const results: number[] = [];
	for (let i = 0; i < rollCount; i++) {
		results.push(rollDice(sides, diceCount));
	}
	return {
		rolls: results,
		total: results.reduce((sum, roll) => sum + roll, 0),
	};
}

/**
 * Shorthand for rolling a specific type of die
 * Example: roll.d20(), roll.d6(3) for 3d6
 */
export const roll = {
	d4: (count: number = 1) => rollDice(4, count),
	d6: (count: number = 1) => rollDice(6, count),
	d8: (count: number = 1) => rollDice(8, count),
	d10: (count: number = 1) => rollDice(10, count),
	d12: (count: number = 1) => rollDice(12, count),
	d20: (count: number = 1) => rollDice(20, count),
	d100: (count: number = 1) => rollDice(100, count),
};

/**
 * Linear interpolation between two values
 * @param start Starting value
 * @param end Ending value
 * @param t Interpolation factor (0-1)
 */
export function lerp(start: number, end: number, t: number): number {
	// Clamp t between 0 and 1
	t = Math.max(0, Math.min(1, t));
	return start + (end - start) * t;
}

/**
 * Returns true with probability p
 * @param p Probability between 0 and 1
 */
export function chance(p: number): boolean {
	return Math.random() < p;
}
