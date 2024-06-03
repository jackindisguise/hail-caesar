import { Player } from "./player.js";
import { expect } from "chai";

describe("player.ts", () => {
	const p = new Player();
	const password = "cake";
	it("set password", (done) => {
		expect(p.password).is.equal(undefined);
		p.password = "cake";
		expect(p.password).is.not.equal(undefined);
		done();
	});

	it("check(password)", (done) => {
		const np = new Player();
		expect(np.check(password)).is.false;
		const original = p.password;
		const bad = p.check(password + "1");
		expect(bad).is.false;
		const checked = p.check(password);
		expect(checked).is.true;
		done();
	});
});
