import * as color from "./color.js";
import * as string from "./string.js";
import { expect } from "chai";

describe("color.ts", () => {
	it("Colorizer", () => {
		expect(color.Colorizer.clear("a")).is.equal("{xa{x");
		expect(color.Colorizer.italic("a")).is.equal("{@a{x");
		expect(color.Colorizer.reverse("a")).is.equal("{^a{x");
		expect(color.Colorizer.underline("a")).is.equal("{#a{x");
		expect(color.Colorizer.strikeThrough("a")).is.equal("{-a{x");
		expect(color.Colorizer.black("a")).is.equal("{Xa{x");
		expect(color.Colorizer.maroon("a")).is.equal("{ra{x");
		expect(color.Colorizer.green("a")).is.equal("{ga{x");
		expect(color.Colorizer.olive("a")).is.equal("{ya{x");
		expect(color.Colorizer.navy("a")).is.equal("{ba{x");
		expect(color.Colorizer.purple("a")).is.equal("{pa{x");
		expect(color.Colorizer.teal("a")).is.equal("{ca{x");
		expect(color.Colorizer.silver("a")).is.equal("{wa{x");
		expect(color.Colorizer.grey("a")).is.equal("{Da{x");
		expect(color.Colorizer.crimson("a")).is.equal("{Ra{x");
		expect(color.Colorizer.lime("a")).is.equal("{Ga{x");
		expect(color.Colorizer.yellow("a")).is.equal("{Ya{x");
		expect(color.Colorizer.blue("a")).is.equal("{Ba{x");
		expect(color.Colorizer.pink("a")).is.equal("{Pa{x");
		expect(color.Colorizer.cyan("a")).is.equal("{Ca{x");
		expect(color.Colorizer.white("a")).is.equal("{Wa{x");
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
