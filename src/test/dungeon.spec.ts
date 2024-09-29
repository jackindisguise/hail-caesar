import { expect } from "chai";
import { Dungeon, DungeonObject, Mob, Tile } from "../dungeon.js";

describe("dungeon.ts", () => {
	describe("Dungeon", () => {
		let d: Dungeon;
		it("new", (done) => {
			d = new Dungeon({ width: 2, height: 2, layers: 2 });
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
			expect(t.display).is.equal("Tile");

			try {
				d.getTile(10, 10, 10);
			} catch (e) {
				expect((e as Error).message).is.equal("invalid Dungeon tile bounds");
			}
			done();
		});
	});

	describe("DungeonObject", () => {
		const dung = new Dungeon({ width: 3, height: 3, layers: 3 });
		const dung2 = new Dungeon({ width: 3, height: 3, layers: 3 });
		let dungo: DungeonObject;
		it("new", (done) => {
			dungo = new DungeonObject();
			expect(dungo.dungeon).is.undefined;
			done();
		});

		describe("location=", () => {
			const tileA = dung.getTile(0, 0, 0);
			const tileB = dung.getTile(1, 0, 0);
			const tileC = dung2.getTile(0, 0, 0);
			it("intial", (done) => {
				expect(dungo.dungeon).is.not.equal(tileA.dungeon);
				expect(dungo.dungeon).is.not.equal(tileB.dungeon);
				expect(dungo.dungeon).is.not.equal(tileC.dungeon);
				dungo.location = tileA;
				expect(dungo.dungeon).is.equal(tileA.dungeon);
				expect(dungo.dungeon).is.equal(tileB.dungeon);
				expect(dungo.dungeon).is.not.equal(tileC.dungeon);
				expect(dungo.dungeon).is.equal(dung);
				expect(dungo.dungeon).is.not.equal(dung2);
				expect(tileA.contains(dungo)).is.true;
				expect(tileB.contains(dungo)).is.false;
				expect(tileC.contains(dungo)).is.false;
				expect(dung.contains(dungo)).is.true;
				expect(dung2.contains(dungo)).is.false;
				done();
			});
			it("secondary", (done) => {
				expect(dungo.dungeon).is.equal(tileA.dungeon);
				expect(dungo.dungeon).is.equal(tileB.dungeon);
				expect(dungo.dungeon).is.not.equal(tileC.dungeon);
				dungo.location = tileB;
				expect(dungo.dungeon).is.equal(tileA.dungeon);
				expect(dungo.dungeon).is.equal(tileB.dungeon);
				expect(dungo.dungeon).is.not.equal(tileC.dungeon);
				expect(dungo.dungeon).is.equal(dung);
				expect(dungo.dungeon).is.not.equal(dung2);
				expect(tileA.contains(dungo)).is.false;
				expect(tileB.contains(dungo)).is.true;
				expect(tileC.contains(dungo)).is.false;
				expect(dung.contains(dungo)).is.true;
				expect(dung2.contains(dungo)).is.false;
				done();
			});
			it("different dungeon", (done) => {
				expect(dungo.dungeon).is.equal(tileA.dungeon);
				expect(dungo.dungeon).is.equal(tileB.dungeon);
				expect(dungo.dungeon).is.not.equal(tileC.dungeon);
				dungo.location = tileC;
				expect(dungo.dungeon).is.not.equal(tileA.dungeon);
				expect(dungo.dungeon).is.not.equal(tileB.dungeon);
				expect(dungo.dungeon).is.equal(tileC.dungeon);
				expect(dungo.dungeon).is.not.equal(dung);
				expect(dungo.dungeon).is.equal(dung2);
				expect(tileA.contains(dungo)).is.false;
				expect(tileB.contains(dungo)).is.false;
				expect(tileC.contains(dungo)).is.true;
				expect(dung.contains(dungo)).is.false;
				expect(dung2.contains(dungo)).is.true;
				done();
			});
		});
	});
});
