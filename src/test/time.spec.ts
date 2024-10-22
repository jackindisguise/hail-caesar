import { expect } from "chai";
import {
	setAbsoluteInterval,
	setRelativeInterval,
	clearCustomInterval,
} from "../time.js";

const timeout = 2000;
const ms = 500;
describe("time.ts", () => {
	xit("setAbsoluteInterval", (done) => {
		const start = Date.now();
		let diff = 0;
		let cycle = 0;
		const intervalID = setAbsoluteInterval(() => {
			cycle++;
			const now = Date.now();
			const target = Math.floor(start / ms) * ms + ms * cycle;
			diff += now - target;
		}, ms);
		setTimeout(() => {
			clearCustomInterval(intervalID, 99999);
			expect(diff / cycle).is.lessThanOrEqual(30); // diff is within 30ms
			done();
		}, timeout);
	}).timeout(timeout * 1.1);

	xit("setRelativeInterval", (done) => {
		const start = Date.now();
		let diff = 0;
		let cycle = 0;
		const intervalID = setRelativeInterval(() => {
			cycle++;
			const now = Date.now();
			const target = start + ms * cycle;
			diff += now - target;
		}, ms);
		setTimeout(() => {
			clearCustomInterval(intervalID, 99999);
			expect(diff / cycle).is.lessThanOrEqual(30); // diff is within 30ms
			done();
		}, timeout);
	}).timeout(timeout * 1.1);
});
