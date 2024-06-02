import { expect } from "chai";
import { add } from "./init.js";

describe("init.ts", () => {
	describe("add()", () => {
		it("add(a)", (done) => {
			const line1 = add(1);
			expect(line1).is.equal(1);
			done();
		});
		it("add(a,b)", (done) => {
			//const line2 = add(1, 2);
			//expect(line2).is.equal(3);
			done();
		});
	});
});
