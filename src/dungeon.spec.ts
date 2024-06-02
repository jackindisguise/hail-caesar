import { expect } from "chai";
import { Dungeon, Tile } from "./dungeon.js";

describe("dungeon.ts", () => {
	describe("Dungeon", () => {
		let d: Dungeon;
		it("new", (done) => {
			d = new Dungeon(2, 2, 2);
			expect(d.width).is.equal(2);
			expect(d.height).is.equal(2);
			expect(d.layers).is.equal(2);
			done();
		});

		it("setDimensions", (done) => {
			try {
				d.setDimensions(3, 3, 3);
			} catch (e) {
				expect((e as Error).message).is.equal("Dungeon already initialized");
				done();
			}
		});

		it("resizeWidth", (done) => {
			try {
				d.getTile(2, 0, 0);
			} catch (e) {
				expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
			}
			d.resizeWidth(3);
			expect(d.getTile(2, 0, 0)).is.not.undefined;
			done();
		});

		it("resizeHeight", (done) => {
			try {
				d.getTile(0, 2, 0);
			} catch (e) {
				expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
			}
			d.resizeHeight(3);
			expect(d.getTile(0, 2, 0)).is.not.undefined;
			done();
		});

		it("resizeLayers", (done) => {
			try {
				d.getTile(0, 0, 2);
			} catch (e) {
				expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
			}
			d.resizeLayers(3);
			expect(d.getTile(0, 0, 2)).is.not.undefined;
			done();
		});

		it("getTile()", (done) => {
			let t = d.getTile(0, 0, 0);
			expect(t).is.not.undefined;
			expect((t as Tile).display).is.equal("Tile");

			try {
				d.getTile(10, 10, 10);
			} catch (e) {
				expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
			}
			done();
		});
	});
});
