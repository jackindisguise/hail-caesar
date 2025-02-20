import { equal, notEqual, ok, fail, throws } from "node:assert/strict";
import { test, suite } from "node:test";
import { Dungeon, Tile } from "./dungeon.js";

suite("dungeon.js", () => {
	suite("Dungeon", () => {
		test("constructor()", () => {
			const d = new Dungeon({ name: "cake" });
			const d2 = new Dungeon({ name: "cake2" });
			notEqual(d, d2);
		});
	});

	suite("Tile", () => {
		test("constructor()", () => {
			const t = new Tile({ x: 0, y: 1, z: 2 });
			equal(t.x, 0);
			equal(t.y, 1);
			equal(t.z, 2);
		});
	});
});
