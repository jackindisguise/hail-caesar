import { expect } from "chai";
import * as time from "./time.js";

const timeout = 2000;
const ms = 500;
describe("time.ts", () => {
	xit("setAbsoluteInterval", (done) => {
		const start = Date.now();
		let diff = 0;
		let cycle = 0;
		const intervalID = time.setAbsoluteInterval(() => {
			cycle++;
			const now = Date.now();
			const target = Math.floor(start / ms) * ms + ms * cycle;
			diff += now - target;
		}, ms);
		setTimeout(() => {
			time.clearCustomInterval(intervalID, 99999);
			expect(diff / cycle).is.lessThanOrEqual(30); // diff is within 30ms
			done();
		}, timeout);
	}).timeout(timeout * 1.1);

	xit("setRelativeInterval", (done) => {
		const start = Date.now();
		let diff = 0;
		let cycle = 0;
		const intervalID = time.setRelativeInterval(() => {
			cycle++;
			const now = Date.now();
			const target = start + ms * cycle;
			diff += now - target;
		}, ms);
		setTimeout(() => {
			time.clearCustomInterval(intervalID, 99999);
			expect(diff / cycle).is.lessThanOrEqual(30); // diff is within 30ms
			done();
		}, timeout);
	}).timeout(timeout * 1.1);
});
