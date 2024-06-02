import { pick, replace } from "./array.js";
import { expect } from "chai";

describe("array.ts", () => {
	it("pick", (done) => {
		const options: number[] = [1, 2, 3];
		const chosen: number = pick(...options);
		expect(chosen).is.within(1, 3);
		done();
	});

	it("replace", (done) => {
		const str: string[] = ["This", "is", "a", "test."];
		const replaced: string[] = replace(str, "test.", "stick-up.");
		expect(replaced.join(" ")).is.equal("This is a stick-up.");
		done();
	});
});
