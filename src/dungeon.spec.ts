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

		describe("resizeWidth", () => {
			it("expand", (done) => {
				try {
					d.getTile(2, 0, 0);
				} catch (e) {
					expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
				}
				d.resizeWidth(4);
				expect(d.getTile(3, 0, 0)).is.not.undefined;
				done();
			});

			it("shrink", (done) => {
				d.resizeWidth(3);
				try {
					d.getTile(3, 0, 0);
				} catch (e) {
					expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
				}
				done();
			});
		});

		describe("resizeHeight", () => {
			it("expand", (done) => {
				try {
					d.getTile(0, 2, 0);
				} catch (e) {
					expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
				}
				d.resizeHeight(4);
				expect(d.getTile(0, 3, 0)).is.not.undefined;
				done();
			});

			it("shrink", (done) => {
				d.resizeHeight(3);
				try {
					d.getTile(0, 3, 0);
				} catch (e) {
					expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
				}
				done();
			});
		});

		describe("resizeLayers", () => {
			it("expand", (done) => {
				try {
					d.getTile(0, 0, 2);
				} catch (e) {
					expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
				}
				d.resizeLayers(4);
				expect(d.getTile(0, 0, 3)).is.not.undefined;
				done();
			});

			it("shrink", (done) => {
				d.resizeLayers(3);
				try {
					d.getTile(0, 0, 3);
				} catch (e) {
					expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
				}
				done();
			});
		});

		it("getTile", (done) => {
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
