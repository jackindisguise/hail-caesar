import { Colorizer, ESCAPE_SIZER } from "../color.js";
import {
	padLeft,
	padRight,
	padCenter,
	wrap,
	box as _box,
	BOX_STYLE,
} from "../string.js";
import { EOL } from "../telnet.js";
import { expect } from "chai";

describe("color.ts", () => {
	it("Colorizer", () => {
		expect(Colorizer.clear("a")).is.equal("{xa{x");
		expect(Colorizer.italic("a")).is.equal("{@a{x");
		expect(Colorizer.reverse("a")).is.equal("{^a{x");
		expect(Colorizer.underline("a")).is.equal("{#a{x");
		expect(Colorizer.strikeThrough("a")).is.equal("{-a{x");
		expect(Colorizer.black("a")).is.equal("{Xa{x");
		expect(Colorizer.maroon("a")).is.equal("{ra{x");
		expect(Colorizer.green("a")).is.equal("{ga{x");
		expect(Colorizer.olive("a")).is.equal("{ya{x");
		expect(Colorizer.navy("a")).is.equal("{ba{x");
		expect(Colorizer.purple("a")).is.equal("{pa{x");
		expect(Colorizer.teal("a")).is.equal("{ca{x");
		expect(Colorizer.silver("a")).is.equal("{wa{x");
		expect(Colorizer.grey("a")).is.equal("{Da{x");
		expect(Colorizer.crimson("a")).is.equal("{Ra{x");
		expect(Colorizer.lime("a")).is.equal("{Ga{x");
		expect(Colorizer.yellow("a")).is.equal("{Ya{x");
		expect(Colorizer.blue("a")).is.equal("{Ba{x");
		expect(Colorizer.pink("a")).is.equal("{Pa{x");
		expect(Colorizer.cyan("a")).is.equal("{Ca{x");
		expect(Colorizer.white("a")).is.equal("{Wa{x");
	});
	describe("ESCAPE_SIZER", () => {
		it("padLeft", (done) => {
			const str = "{REXAMPLETXT{x";
			const result = padLeft(str, 20, "-", ESCAPE_SIZER);
			const expected = `----------${str}`;
			expect(expected).is.equal(result);
			done();
		});
		it("padCenter", (done) => {
			const str = "{REXAMPLETXT{x";
			const result = padCenter(str, 20, "-", ESCAPE_SIZER);
			const expected = `-----${str}-----`;
			expect(expected).is.equal(result);
			done();
		});
		it("padRight", (done) => {
			const str = "{REXAMPLETXT{x";
			const result = padRight(str, 20, "-", ESCAPE_SIZER);
			const expected = `${str}----------`;
			expect(expected).is.equal(result);
			done();
		});
		it("wrap", (done) => {
			const str = [
				"In the {Ddimly{x lit chamber, the {Cair{x hung heavy with the scent of {yaged leather{x and {ymusty parchment{x.",
				"{YSunlight{x filtered reluctantly through heavy {pvelvet{x curtains, casting faint {Ygolden rays{x that danced upon the polished {yoak floor{x.",
			];
			const wrapped = wrap(str.join(" "), 30, ESCAPE_SIZER);
			expect(wrapped.join(EOL)).is.equal(
				[
					"In the {Ddimly{x lit chamber, the",
					"{Cair{x hung heavy with the scent",
					"of {yaged leather{x and {ymusty",
					"parchment{x. {YSunlight{x filtered",
					"reluctantly through heavy",
					"{pvelvet{x curtains, casting faint",
					"{Ygolden rays{x that danced upon",
					"the polished {yoak floor{x.",
				].join(EOL)
			);
			done();
		});
		it("box", (done) => {
			const str = [
				"In the {Ddimly{x lit chamber, the {Cair{x hung heavy with the scent of {yaged leather{x and {ymusty parchment{x.",
				"{YSunlight{x filtered reluctantly through heavy {pvelvet{x curtains, casting faint {Ygolden rays{x that danced upon the polished {yoak floor{x.",
			];
			const box = _box(
				[str.join(" ")],
				80,
				"EXAMPLE",
				{
					...BOX_STYLE.PLAIN,
					borderColor: Colorizer.yellow,
					titleColor: Colorizer.lime,
					bodyColor: Colorizer.white,
				},
				ESCAPE_SIZER
			);
			expect(box.join(EOL)).is.equal(
				[
					"{Y+-{x {GEXAMPLE{x {Y--------------------------------------------------------------------+{x",
					"{Y|{x {WIn the {Ddimly{x{W lit chamber, the {Cair{x{W hung heavy with the scent of {yaged leather{x{W{x  {Y|{x",
					"{Y|{x {Wand {ymusty parchment{x{W. {YSunlight{x{W filtered reluctantly through heavy {pvelvet{x{W{x      {Y|{x",
					"{Y|{x {Wcurtains, casting faint {Ygolden rays{x{W that danced upon the polished {yoak floor{x{W.{x {Y|{x",
					"{Y+------------------------------------------------------------------------------+{x",
				].join(EOL)
			);
			done();
		});
	});
});
