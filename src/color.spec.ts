import * as color from "./color.js";
import * as string from "./string.js";
import { expect } from "chai";

describe("color.ts", () => {
	describe("Colorizer", () => {
		it("clear", () => {
			expect(color.Colorizer.clear("a")).is.equal("{xa{x");
		});
		it("italic", () => {
			expect(color.Colorizer.italic("a")).is.equal("{@a{x");
		});
		it("reverse", () => {
			expect(color.Colorizer.reverse("a")).is.equal("{^a{x");
		});
		it("underline", () => {
			expect(color.Colorizer.underline("a")).is.equal("{#a{x");
		});
		it("strikethrough", () => {
			expect(color.Colorizer.strikeThrough("a")).is.equal("{-a{x");
		});
		it("black", () => {
			expect(color.Colorizer.black("a")).is.equal("{Xa{x");
		});
		it("maroon", () => {
			expect(color.Colorizer.maroon("a")).is.equal("{ra{x");
		});
		it("green", () => {
			expect(color.Colorizer.green("a")).is.equal("{ga{x");
		});
		it("olive", () => {
			expect(color.Colorizer.olive("a")).is.equal("{ya{x");
		});
		it("navy", () => {
			expect(color.Colorizer.navy("a")).is.equal("{ba{x");
		});
		it("purple", () => {
			expect(color.Colorizer.purple("a")).is.equal("{pa{x");
		});
		it("teal", () => {
			expect(color.Colorizer.teal("a")).is.equal("{ca{x");
		});
		it("silver", () => {
			expect(color.Colorizer.silver("a")).is.equal("{wa{x");
		});
		it("grey", () => {
			expect(color.Colorizer.grey("a")).is.equal("{Da{x");
		});
		it("crimson", () => {
			expect(color.Colorizer.crimson("a")).is.equal("{Ra{x");
		});
		it("lime", () => {
			expect(color.Colorizer.lime("a")).is.equal("{Ga{x");
		});
		it("yellow", () => {
			expect(color.Colorizer.yellow("a")).is.equal("{Ya{x");
		});
		it("blue", () => {
			expect(color.Colorizer.blue("a")).is.equal("{Ba{x");
		});
		it("pink", () => {
			expect(color.Colorizer.pink("a")).is.equal("{Pa{x");
		});
		it("cyan", () => {
			expect(color.Colorizer.cyan("a")).is.equal("{Ca{x");
		});
		it("white", () => {
			expect(color.Colorizer.white("a")).is.equal("{Wa{x");
		});
	});
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
