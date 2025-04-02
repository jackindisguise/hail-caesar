import { test, suite } from "node:test";
import { ok, equal, deepEqual } from "node:assert/strict";
import {
	randomInt,
	random,
	rollDice,
	roll,
	lerp,
	chance,
	rollAndKeep,
} from "./math.js";

suite("utils/math.ts", () => {
	suite("randomInt", () => {
		test("should return number within range", () => {
			for (let i = 0; i < 1000; i++) {
				const result = randomInt(1, 10);
				ok(result >= 1 && result <= 10);
			}
		});

		test("should handle same min and max", () => {
			const result = randomInt(5, 5);
			equal(result, 5);
		});

		test("should have uniform distribution", () => {
			const min = 1;
			const max = 6;
			const iterations = 10000;
			const counts = new Array(max - min + 1).fill(0);
			const expectedCount = iterations / counts.length;

			// Generate random numbers and count occurrences
			for (let i = 0; i < iterations; i++) {
				const result = randomInt(min, max);
				counts[result - min]++;
			}

			// Chi-square test for uniformity
			const chiSquare = counts.reduce((sum, count) => {
				const difference = count - expectedCount;
				return sum + (difference * difference) / expectedCount;
			}, 0);

			// For 5 degrees of freedom (6 possible values - 1) and p = 0.05,
			// critical value is 11.07. We use a slightly higher value to reduce
			// false failures
			ok(
				chiSquare < 12,
				`Distribution is not uniform (chi-square = ${chiSquare})`
			);

			// Also check that no value deviates more than 10% from expected
			const allowedDeviation = expectedCount * 0.1;
			ok(
				counts.every(
					(count) => Math.abs(count - expectedCount) < allowedDeviation
				),
				"Some values appear too frequently or too rarely"
			);
		});
	});

	suite("random", () => {
		test("should generate numbers between 0 and 1 inclusively", () => {
			const iterations = 100000000;
			let sum = 0;
			let zeroes = 0;
			let ones = 0;

			for (let i = 0; i < iterations; i++) {
				const num = random();
				if (num === 0) zeroes++;
				if (num === 1) ones++;
				sum += num;
			}

			const average = sum / iterations;

			// check if there are ones and zeroes
			ok(zeroes > 0);
			ok(ones > 0);

			// Check if the distribution is roughly uniform
			ok(Math.abs(average - 0.5) < 0.05); // Within 5% of expected
		});
	});

	suite("rollDice", () => {
		test("should roll single die correctly", () => {
			const result = rollDice(6);
			ok(result >= 1 && result <= 6);
		});

		test("should roll multiple dice correctly", () => {
			const result = rollDice(6, 3);
			ok(result >= 3 && result <= 18);
		});
	});

	suite("rollAndKeep", () => {
		test("should keep multiple roll results", () => {
			const result = rollAndKeep(6, 2, 3);
			equal(result.rolls.length, 3);
			ok(result.rolls.every((roll) => roll >= 2 && roll <= 12));
			equal(
				result.total,
				result.rolls.reduce((sum, roll) => sum + roll, 0)
			);
		});

		test("should handle single die and single roll", () => {
			const result = rollAndKeep(20);
			equal(result.rolls.length, 1);
			ok(result.rolls[0] >= 1 && result.rolls[0] <= 20);
			equal(result.total, result.rolls[0]);
		});
	});

	suite("roll shortcuts", () => {
		test("should handle d20 rolls", () => {
			const result = roll.d20();
			ok(result >= 1 && result <= 20);
		});

		test("should handle multiple d6", () => {
			const result = roll.d6(3);
			ok(result >= 3 && result <= 18);
		});
	});

	suite("lerp", () => {
		test("should interpolate correctly", () => {
			equal(lerp(0, 100, 0), 0);
			equal(lerp(0, 100, 1), 100);
			equal(lerp(0, 100, 0.5), 50);
		});

		test("should clamp t value", () => {
			equal(lerp(0, 100, -1), 0);
			equal(lerp(0, 100, 2), 100);
		});

		test("should handle negative numbers", () => {
			equal(lerp(-100, 100, 0.5), 0);
		});
	});

	suite("chance", () => {
		test("should always return false for 0", () => {
			equal(chance(0), false);
		});

		test("should always return true for 1", () => {
			equal(chance(1), true);
		});

		test("should return roughly correct distribution", () => {
			const iterations = 10000;
			let trueCount = 0;
			for (let i = 0; i < iterations; i++) if (chance(0.7)) trueCount++;
			const ratio = trueCount / iterations;
			ok(Math.abs(ratio - 0.7) < 0.05); // Within 5% of expected
		});
	});
});
