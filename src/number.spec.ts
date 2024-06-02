import * as number from "./number.js";
import { expect, assert } from "chai";

describe("number.ts", () => {
	it("lerp", (done) => {
		expect(number.lerp(0, 100, 0.5)).is.equal(50);
		expect(number.lerp(-50, 50, 0.5)).is.equal(0);
		done();
	});

	describe("randomInt", () => {
		it("low<=result<=high", (done) => {
			const tests = 10000;
			const low = 100;
			const high = 500;
			for (let i = 0; i < tests; i++) {
				const result = number.randomInt(low, high);
				assert(low <= result && result <= high);
			}
			done();
		});

		it("full range", (done) => {
			const tests = 10000;
			const low = 10;
			const high = 20;
			const range = high - low + 1;
			const results: number[] = [];
			for (let i = 0; i < tests; i++) {
				const result = number.randomInt(low, high);
				if (results.includes(result)) continue;
				results.push(result);
			}
			expect(results.length).is.equal(range);
			done();
		});

		it("reliable distribution", (done) => {
			const tests = 100000;
			const low = 1;
			const high = 5;
			const range = high - low + 1;
			const results: number[] = new Array(range);
			const expectedDistribution = tests / range;
			for (let i = 0; i < tests; i++) {
				const result = number.randomInt(low, high);
				if (results[result - low]) results[result - low]++;
				else results[result - low] = 1;
			}
			for (let i = low; i <= high; i++)
				expect(results[i - low]).is.within(
					expectedDistribution * 0.95,
					expectedDistribution * 1.05
				);
			done();
		});
	});

	it("roll", (done) => {
		const tests = 10000;
		for (let i = 0; i < tests; i++)
			expect(number.roll(2, 100)).is.within(2, 200);
		for (let i = 0; i < tests; i++)
			expect(number.roll(2, 100, 5)).is.within(7, 205);
		for (let i = 0; i < tests; i++)
			expect(number.roll(2, 100, -5)).is.within(-3, 195);
		done();
	});

	it("actualRoll", (done) => {
		const die = 2;
		const sides = 6;
		const tests = 10000;
		for (let i = 0; i < tests; i++) {
			const results = number.actualRoll(die, sides);
			for (const result of results) expect(result).is.within(1, sides);
			expect(results.reduce((sum, a) => (sum += a), 0)).is.within(
				die,
				die + die * sides
			);
		}
		done();
	});
});
