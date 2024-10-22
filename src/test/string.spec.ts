import {
	padLeft,
	padRight,
	padCenter,
	pad,
	wrap,
	box as _box,
	matchKeywords,
	autocomplete,
	toOrdinal,
	TERM_SIZER,
	BOX_STYLE,
	BoxStyle,
	PAD_SIDE,
} from "../string.js";
import { expect } from "chai";
import chalk from "chalk";

describe("string.ts", () => {
	it("pad", (done) => {
		expect(pad("test", 3, PAD_SIDE.LEFT)).is.equal("test");
		expect(pad("test", 10, PAD_SIDE.LEFT)).is.equal("      test");
		expect(pad({ string: "test", width: 10, side: PAD_SIDE.LEFT })).is.equal(
			"      test"
		);
		expect(pad("test", 10, PAD_SIDE.LEFT, "-")).is.equal("------test");
		expect(pad("50", 10, PAD_SIDE.LEFT, "0")).is.equal("0000000050");
		expect(pad({ string: "test", width: 10, side: PAD_SIDE.RIGHT })).is.equal(
			"test      "
		);
		expect(
			pad({
				string: "test",
				width: 10,
				side: PAD_SIDE.RIGHT,
				padder: "<>{}",
			})
		).is.equal("test<>{}<>");
		expect(
			pad({
				string: "test",
				width: 10,
				side: PAD_SIDE.RIGHT,
				padder: "-",
			})
		).is.equal("test------");
		expect(
			pad({
				string: "50.",
				width: 10,
				side: PAD_SIDE.RIGHT,
				padder: "0",
			})
		).is.equal("50.0000000");
		expect(
			pad({
				string: "test",
				side: PAD_SIDE.CENTER,
				width: 10,
			})
		).is.equal("   test   ");
		expect(
			pad({
				string: "test",
				width: 10,
				side: PAD_SIDE.CENTER,
				padder: "<>",
			})
		).is.equal("<><test><>");
		expect(
			pad({
				string: "test",
				width: 80,
				side: PAD_SIDE.CENTER,
				padder: "<->",
			})
		).is.equal(
			"<-><-><-><-><-><-><-><-><-><-><-><-><-test<-><-><-><-><-><-><-><-><-><-><-><-><-"
		);
		expect(
			pad({
				string: "test",
				width: 10,
				side: PAD_SIDE.CENTER,
				padder: "-",
			})
		).is.equal("---test---");
		expect(
			pad({
				string: "test",
				width: 11,
				side: PAD_SIDE.CENTER,
				padder: "-",
			})
		).is.equal("---test----");
		done();
	});

	it("padLeft", (done) => {
		expect(padLeft("test", 3)).is.equal("test");
		expect(padLeft("test", 10)).is.equal("      test");
		expect(padLeft("test", 10, "<><>")).is.equal("<><><>test");
		expect(padLeft("test", 10, "<>", TERM_SIZER, chalk.yellow)).is.equal(
			`${chalk.yellow("<><><>")}test`
		);
		expect(padLeft({ string: "test", width: 10 })).is.equal("      test");
		expect(padLeft({ string: "test", width: 10, padder: "-" })).is.equal(
			"------test"
		);
		expect(padLeft({ string: "50", width: 10, padder: "0" })).is.equal(
			"0000000050"
		);
		done();
	});

	it("padRight", (done) => {
		expect(padRight("test", 3)).is.equal("test");
		expect(padRight("test", 10)).is.equal("test      ");
		expect(padRight("test", 10, "<><>")).is.equal("test<><><>");
		expect(padRight("test", 10, "<>", TERM_SIZER, chalk.yellow)).is.equal(
			`test${chalk.yellow("<><><>")}`
		);
		expect(padRight({ string: "test", width: 10 })).is.equal("test      ");
		expect(padRight({ string: "test", width: 10, padder: "<>{}" })).is.equal(
			"test<>{}<>"
		);
		expect(padRight({ string: "test", width: 10, padder: "-" })).is.equal(
			"test------"
		);
		expect(padRight({ string: "50.", width: 10, padder: "0" })).is.equal(
			"50.0000000"
		);
		done();
	});

	it("padCenter", (done) => {
		expect(padCenter("test", 3)).is.equal("test");
		expect(padCenter("test", 10)).is.equal("   test   ");
		expect(padCenter("test", 10, "<><>")).is.equal("<><test><>");
		expect(padCenter("test", 10, "<>", TERM_SIZER, chalk.yellow)).is.equal(
			`${chalk.yellow("<><")}test${chalk.yellow("><>")}`
		);
		expect(padCenter("test", 5, "<>", TERM_SIZER, chalk.yellow)).is.equal(
			`test${chalk.yellow("<")}`
		);

		expect(padCenter({ string: "test", width: 10 })).is.equal("   test   ");
		expect(padCenter({ string: "test", width: 10, padder: "<>" })).is.equal(
			"<><test><>"
		);
		expect(padCenter({ string: "test", width: 80, padder: "<->" })).is.equal(
			"<-><-><-><-><-><-><-><-><-><-><-><-><-test<-><-><-><-><-><-><-><-><-><-><-><-><-"
		);
		expect(padCenter({ string: "test", width: 10, padder: "-" })).is.equal(
			"---test---"
		);
		expect(padCenter({ string: "test", width: 11, padder: "-" })).is.equal(
			"---test----"
		);
		done();
	});

	it("color", (done) => {
		const str = chalk.red("this is a test");
		const padded = padCenter({
			string: str,
			width: 50,
			padder: "-",
			sizer: TERM_SIZER,
			color: chalk.blue,
		});
		const expected = `${chalk.blue("------------------")}${str}${chalk.blue(
			"------------------"
		)}`;
		expect(expected).is.equal(padded);
		done();
	});

	describe("wrap", () => {
		it("bug", (done) => {
			const line = padCenter(
				chalk.green(" Centered "),
				76,
				"<*>",
				TERM_SIZER,
				chalk.yellow
			);
			const box = _box({
				input: [line],
				width: 80,
				style: BOX_STYLE.O,
				sizer: TERM_SIZER,
			}).join("\n");
			const expected = `\
OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO\n\
O ${chalk.yellow("<*><*><*><*><*><*><*><*><*><*><*>")}${chalk.green(
				" Centered "
			)}${chalk.yellow("*><*><*><*><*><*><*><*><*><*><*><")} O\n\
OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO`;

			expect(box).is.equal(expected);
			done();
		});

		it("color", (done) => {
			const lorem = [
				"This is a test. This is a test. This is a test.",
				`This is a ${chalk.magenta("test")}. This is a ${chalk.yellow(
					"test"
				)}. This is a ${chalk.cyan("test")}.`,
			];
			const expected = [
				"This is a test.",
				"This is a test.",
				"This is a test.",
				`This is a ${chalk.magenta("test")}.`,
				`This is a ${chalk.yellow("test")}.`,
				`This is a ${chalk.cyan("test")}.`,
			].join("\n");
			const wrapped = wrap({
				string: lorem.join(" "),
				width: 15,
				sizer: TERM_SIZER,
			}).join("\n");
			expect(wrapped).is.equal(expected);
			done();
		});
		it("ideal", (done) => {
			const lorem = [
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				"Vestibulum mollis tortor a risus varius, sed euismod lectus ultricies.",
				"Nam sodales gravida lectus a pretium.",
				"Integer eget risus vitae purus viverra aliquam.",
				"Ut vehicula felis et facilisis blandit.",
				"Vestibulum elementum at enim in viverra.",
				"Donec tincidunt vel magna non pharetra.",
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				"Vestibulum dolor magna, iaculis in velit eu, fermentum tincidunt metus.",
			];
			const blob = lorem.join(" ");
			const limited = wrap(blob, 80).join("-");
			const expected = [
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum mollis",
				"tortor a risus varius, sed euismod lectus ultricies. Nam sodales gravida lectus",
				"a pretium. Integer eget risus vitae purus viverra aliquam. Ut vehicula felis et",
				"facilisis blandit. Vestibulum elementum at enim in viverra. Donec tincidunt vel",
				"magna non pharetra. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
				"Vestibulum dolor magna, iaculis in velit eu, fermentum tincidunt metus.",
			].join("-");
			expect(limited).is.equal(expected);
			done();
		});

		it("long", (done) => {
			const lorem = "a".repeat(80) + "b".repeat(80);
			const limited = wrap({ string: lorem, width: 80 }).join("*");
			const expected = [
				//12345678901234567890123456789012345678901234567890123456789012345678901234567890
				"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-",
				"abbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb-",
				"bb",
			].join("*");
			expect(limited).is.equal(expected);
			done();
		});

		it("short and long", (done) => {
			const lorem =
				"a aa aaa aaaa aaaaa aaaaaa aaaaaaa aaaaaaaa aaaaaaaaa aaaaaaaaaa aa aaaaaaaaa";
			const limited = wrap({ string: lorem, width: 10 }).join("*");
			const expected = [
				"a aa aaa",
				"aaaa aaaaa",
				"aaaaaa",
				"aaaaaaa",
				"aaaaaaaa",
				"aaaaaaaaa",
				"aaaaaaaaaa",
				"aa aaaaaa-",
				"aaa",
			].join("*");
			expect(limited).is.equal(expected);
			done();
		});
	});

	describe("box", () => {
		it("plain", (done) => {
			const box = _box(["cake", "pie"], 80);
			const expected = [
				"cake                                                                            ",
				"pie                                                                             ",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("top-right specified with title but no top-left", (done) => {
			const box = _box(["cake", "pie"], 80, "title", {
				top: { right: "." },
			});
			const expected = [
				"  title                                                                        .",
				"cake                                                                            ",
				"pie                                                                             ",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("top-left specified with title but no top-right", (done) => {
			const box = _box(["cake", "pie"], 80, "title", {
				top: { left: "." },
			});
			const expected = [
				".  title                                                                        ",
				"cake                                                                            ",
				"pie                                                                             ",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("top-right specified with no title but no top-left", (done) => {
			const box = _box(["cake", "pie"], 80, undefined, {
				top: { right: "." },
			});
			const expected = [
				"                                                                               .",
				"cake                                                                            ",
				"pie                                                                             ",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("top-left specified with no title but no top-right", (done) => {
			const box = _box(["cake", "pie"], 80, undefined, {
				top: { left: "." },
			});
			const expected = [
				".                                                                               ",
				"cake                                                                            ",
				"pie                                                                             ",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("titled", (done) => {
			const box = _box(["cake", "pie"], 80, "A title.");
			const expected = [
				"A title.                                                                        ",
				"cake                                                                            ",
				"pie                                                                             ",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("super long centered title", (done) => {
			const box = _box(
				["cake", "pie"],
				30,
				"A really long title for this box.",
				{
					top: { middle: "-" },
					titleHAlign: PAD_SIDE.CENTER,
				}
			);
			const expected = [
				" A really long title for this box. ",
				"cake                          ",
				"pie                           ",
			];
			expect(box.join("-")).is.equal(expected.join("-"));
			done();
		});
		it("title centered", (done) => {
			const box = _box(["cake", "pie"], 80, "A title.", {
				titleHAlign: PAD_SIDE.CENTER,
			});
			const expected = [
				"                                    A title.                                    ",
				"cake                                                                            ",
				"pie                                                                             ",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("right specified but no left", (done) => {
			const style: BoxStyle = {
				horizontal: "-",
				corner: "+",
				right: "<",
			};
			const box = _box(["cake", "pie"], 80, "cake", style);
			const expected = [
				"+- cake ----------------------------------------------------------------------+",
				" cake                                                                         <",
				" pie                                                                          <",
				"+-----------------------------------------------------------------------------+",
			];
			done();
		});
		it("left specified but no right", (done) => {
			const style: BoxStyle = {
				horizontal: "-",
				corner: "+",
				left: ">",
			};
			const box = _box(["cake", "pie"], 80, "cake", style);
			const expected = [
				"+- cake ----------------------------------------------------------------------+",
				"> cake                                                                         ",
				"> pie                                                                          ",
				"+-----------------------------------------------------------------------------+",
			];
			done();
		});
		it("left-only title border", (done) => {
			const box = _box(["cake", "pie"], 80, "cake", {
				...BOX_STYLE.PLAIN,
				titleBorder: { left: ">" },
			});
			const expected = [
				"+-> cake-----------------------------------------------------------------------+",
				"| cake                                                                         |",
				"| pie                                                                          |",
				"+------------------------------------------------------------------------------+",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("right-only title border", (done) => {
			const box = _box(["cake", "pie"], 80, "cake", {
				...BOX_STYLE.PLAIN,
				titleBorder: { right: "<" },
			});
			const expected = [
				"+-cake <-----------------------------------------------------------------------+",
				"| cake                                                                         |",
				"| pie                                                                          |",
				"+------------------------------------------------------------------------------+",
			];
			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});
		it("color", (done) => {
			const style: BoxStyle = {
				...BOX_STYLE.PLAIN,
				titleBorder: { left: "<", right: ">" },
				hAlign: PAD_SIDE.CENTER,
				borderColor: chalk.yellow,
			};

			const box = _box({
				input: ["This is a test.", `This is a ${chalk.red("test")}.`],
				style: style,
				title: `Go to ${chalk.yellow.bold("HELL")}`,
				width: 30,
				sizer: TERM_SIZER,
			});

			const expected = [
				"\x1B[33m+-\x1B[39m\x1B[33m<\x1B[39m Go to \x1B[33m\x1B[1mHELL\x1B[22m\x1B[39m \x1B[33m>\x1B[39m\x1B[33m-------------+\x1B[39m",
				"\x1B[33m|\x1B[39m      This is a test.       \x1B[33m|\x1B[39m",
				"\x1B[33m|\x1B[39m      This is a \x1B[31mtest\x1B[39m.       \x1B[33m|\x1B[39m",
				"\x1B[33m+----------------------------+\x1B[39m",
			];

			expect(box.join("\r\n")).is.equal(expected.join("\r\n"));
			done();
		});

		it("color + multiline", (done) => {
			const style: BoxStyle = {
				...BOX_STYLE.PLAIN,
				titleBorder: { left: "<", right: ">" },
				hAlign: PAD_SIDE.CENTER,
				borderColor: chalk.yellow,
				bodyColor: chalk.greenBright,
			};

			const box = _box(
				[
					"This is a test. This is a test. This is a test. This is a test. This is a test. This is a test. This is a test.",
				],
				30,
				`Go to ${chalk.yellow.bold("HELL")}`,
				style,
				TERM_SIZER
			);

			const expected = [
				"\x1B[33m+-\x1B[39m\x1B[33m<\x1B[39m Go to \x1B[33m\x1B[1mHELL\x1B[22m\x1B[39m \x1B[33m>\x1B[39m\x1B[33m-------------+\x1B[39m",
				"\x1B[33m|\x1B[39m \x1B[92mThis is a test. This is a\x1B[39m  \x1B[33m|\x1B[39m",
				"\x1B[33m|\x1B[39m \x1B[92mtest. This is a test. This\x1B[39m \x1B[33m|\x1B[39m",
				"\x1B[33m|\x1B[39m \x1B[92mis a test. This is a test.\x1B[39m \x1B[33m|\x1B[39m",
				"\x1B[33m|\x1B[39m \x1B[92mThis is a test. This is a\x1B[39m  \x1B[33m|\x1B[39m",
				"\x1B[33m|\x1B[39m           \x1B[92mtest.\x1B[39m            \x1B[33m|\x1B[39m",
				"\x1B[33m+----------------------------+\x1B[39m",
			];

			expect(box.join("\n")).is.equal(expected.join("\n"));
			done();
		});

		it("weird", (done) => {
			const style: BoxStyle = {
				hPadding: 2,
				vPadding: 1,
				hAlign: PAD_SIDE.LEFT,
				titleHAlign: PAD_SIDE.LEFT,
				top: { middle: "v " },
				bottom: { middle: "^ " },
				left: ">",
				right: "<",
			};

			const generated = _box({
				style: style,
				width: 25,
				input: [
					"This is line 1.",
					"This is line 2.",
					"This is line 3.",
					"Go to hell.",
				],
			}).join("\n");

			const expected = [
				"v v v v v v v v v v v v v",
				">                       <",
				">      This is line 1.  <",
				">      This is line 2.  <",
				">      This is line 3.  <",
				">          Go to hell.  <",
				">                       <",
				"^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^",
			].join("\n");

			expect(generated).is.equal(expected);
			done();
		});

		it("right-aligned (default)", (done) => {
			const generated = _box({
				style: {
					...BOX_STYLE.PLAIN,
					hPadding: 2,
					top: { left: ">>", right: "<<" },
					bottom: { left: ">>", right: "<<" },
					left: ">>",
					right: "<<",
				},
				title: "Box Title",
				input: ["This is a line.", "This is another line."],
				width: 30,
			}).join("\n");

			const expected = [
				">>- Box Title --------------<<",
				">>  This is a line.         <<",
				">>  This is another line.   <<",
				">>--------------------------<<",
			].join("\n");

			expect(generated).is.equal(expected);
			done();
		});

		it("center-aligned", (done) => {
			// copy rounded box style
			const rounded = {
				...BOX_STYLE.ROUNDED,
				hAlign: PAD_SIDE.CENTER,
				titleHAlign: PAD_SIDE.CENTER,
				vPadding: 1,
			};

			// generate a rounded box
			const generated = _box({
				style: rounded,
				title: "Box Title",
				input: ["This is a line.", "This is another line."],
				width: 30,
			}).join("\n");

			// test against expected
			const expected = [
				".-------- Box Title ---------.",
				"|                            |",
				"|      This is a line.       |",
				"|   This is another line.    |",
				"|                            |",
				"'----------------------------'",
			].join("\n");

			expect(generated).is.equal(expected);
			done();
		});

		it("left-aligned", (done) => {
			// copy O box style
			const obox: BoxStyle = {
				...BOX_STYLE.O,
				top: { corner: "o" },
				hAlign: PAD_SIDE.LEFT,
				titleHAlign: PAD_SIDE.LEFT,
			};

			// generate an O box
			const generated = _box({
				style: obox,
				title: "Box Title",
				input: ["This is a line.", "This is another line."],
				width: 30,
			}).join("\n");

			// test against expected
			const expected = [
				"oOOOOOOOOOOOOOOOO Box Title Oo",
				"O            This is a line. O",
				"O      This is another line. O",
				"OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
			].join("\n");

			expect(generated).is.equal(expected);
			done();
		});

		it("blank boxes", (done) => {
			// blank-ass box
			const blank = {
				hAlign: PAD_SIDE.CENTER,
				titleHAlign: PAD_SIDE.CENTER,
				corner: "+",
			};

			// generate a rounded box
			const generated = _box({
				style: blank,
				title: "Box Title",
				input: ["This is a line.", "This is another line."],
				width: 30,
			}).join("\n");

			// test against expected
			const expected = [
				"+         Box Title          +",
				"       This is a line.        ",
				"    This is another line.     ",
				"+                            +",
			].join("\n");

			expect(generated).is.equal(expected);
			done();
		});
	});

	it("autocomplete", (done) => {
		expect(autocomplete("", "partial")).is.true;
		expect(autocomplete("p", "partial")).is.true;
		expect(autocomplete("part", "partial")).is.true;
		expect(autocomplete("partial", "part")).is.false;
		done();
	});

	it("matchKeywords", (done) => {
		expect(matchKeywords("the", "the cake is a lie")).is.true;
		expect(matchKeywords("cake", "the cake is a lie")).is.true;
		expect(matchKeywords("the cake", "the cake is a lie")).is.true;
		expect(matchKeywords("the pie", "the cake is a lie")).is.false;
		done();
	});

	it("toOrdinal", (done) => {
		const a = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15, 21, 22, 23, 24, 25];
		const b = [
			"1st",
			"2nd",
			"3rd",
			"4th",
			"5th",
			"11th",
			"12th",
			"13th",
			"14th",
			"15th",
			"21st",
			"22nd",
			"23rd",
			"24th",
			"25th",
		];
		for (let i = 0; i < 15; i++) expect(toOrdinal(a[i])).is.equal(b[i]);
		done();
	});
});
