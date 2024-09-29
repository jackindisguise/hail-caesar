import { Character } from "../character.js";
import { expect } from "chai";

describe("player.ts", () => {
	const p = new Character();
	const password = "cake";
	it("password=", (done) => {
		expect(p.password).is.equal(undefined);
		p.password = "cake";
		expect(p.password).is.not.equal(undefined);
		done();
	});

	it("check", (done) => {
		const np = new Character();
		expect(np.check(password)).is.false;
		const original = p.password;
		const bad = p.check(password + "1");
		expect(bad).is.false;
		const checked = p.check(password);
		expect(checked).is.true;
		done();
	});
});
