import * as color from "./color.js";
import * as string from "./string.js";
import { expect } from "chai";

describe("color.ts", () => {
	describe("ESCAPE_SIZER", () => {
		it("padLeft", (done) => {
			const str = "{REXAMPLETXT{x";
			const result = string.padLeft(str, 20, "-", color.ESCAPE_SIZER);
			const expected = `----------${str}`;
			expect(expected).is.equal(result);
			done();
		});
		it("padCenter", (done) => {
			const str = "{REXAMPLETXT{x";
			const result = string.padCenter(str, 20, "-", color.ESCAPE_SIZER);
			const expected = `-----${str}-----`;
			expect(expected).is.equal(result);
			done();
		});
		it("padRight", (done) => {
			const str = "{REXAMPLETXT{x";
			const result = string.padRight(str, 20, "-", color.ESCAPE_SIZER);
			const expected = `${str}----------`;
			expect(expected).is.equal(result);
			done();
		});
		it("wrap", (done) => {
			const str = [
				"In the {Ddimly{x lit chamber, the {Cair{x hung heavy with the scent of {yaged leather{x and {ymusty parchment{x.",
				"{YSunlight{x filtered reluctantly through heavy {pvelvet{x curtains, casting faint {Ygolden rays{x that danced upon the polished {yoak floor{x.",
			];
			const wrapped = string.wrap(str.join(" "), 30, color.ESCAPE_SIZER);
			expect(wrapped.join("\r\n")).is.equal(
				[
					"In the {Ddimly{x lit chamber, the",
					"{Cair{x hung heavy with the scent",
					"of {yaged leather{x and {ymusty",
					"parchment{x. {YSunlight{x filtered",
					"reluctantly through heavy",
					"{pvelvet{x curtains, casting faint",
					"{Ygolden rays{x that danced upon",
					"the polished {yoak floor{x.",
				].join("\r\n")
			);
			done();
		});
		it("box", (done) => {
			const str = [
				"In the {Ddimly{x lit chamber, the {Cair{x hung heavy with the scent of {yaged leather{x and {ymusty parchment{x.",
				"{YSunlight{x filtered reluctantly through heavy {pvelvet{x curtains, casting faint {Ygolden rays{x that danced upon the polished {yoak floor{x.",
			];
			const box = string.box(
				[str.join(" ")],
				80,
				"EXAMPLE",
				{
					...string.BOX_STYLE.PLAIN,
					borderColor: color.Colorizer.yellow,
					titleColor: color.Colorizer.lime,
					bodyColor: color.Colorizer.white,
				},
				color.ESCAPE_SIZER
			);
			expect(box.join("\r\n")).is.equal(
				[
					"{Y+-{x {GEXAMPLE{x {Y--------------------------------------------------------------------+{x",
					"{Y|{x {WIn the {Ddimly{x{W lit chamber, the {Cair{x{W hung heavy with the scent of {yaged leather{x{W{x  {Y|{x",
					"{Y|{x {Wand {ymusty parchment{x{W. {YSunlight{x{W filtered reluctantly through heavy {pvelvet{x{W{x      {Y|{x",
					"{Y|{x {Wcurtains, casting faint {Ygolden rays{x{W that danced upon the polished {yoak floor{x{W.{x {Y|{x",
					"{Y+------------------------------------------------------------------------------+{x",
				].join("\r\n")
			);
			done();
		});
	});
});
