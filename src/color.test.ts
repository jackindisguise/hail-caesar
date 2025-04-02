import { test, suite } from "node:test";
import { equal } from "node:assert/strict";
import { colorize, stripColors } from "./color.js";

suite("utils/color.ts", () => {
	suite("colorize", () => {
		test("should process basic color codes", () => {
			const input = "This is {rred{x and {bblue{x text";
			const expected =
				"This is \x1b[31mred\x1b[0m and \x1b[34mblue\x1b[0m text";
			equal(colorize(input), expected);
		});

		test("should handle bright colors", () => {
			const input = "{RBright red{x and {Bbright blue{x";
			const expected =
				"\x1b[91mBright red\x1b[0m and \x1b[94mbright blue\x1b[0m";
			equal(colorize(input), expected);
		});

		test("should handle background colors", () => {
			const input = "{/rRed background{x and {/bblue background{x";
			const expected =
				"\x1b[41mRed background\x1b[0m and \x1b[44mblue background\x1b[0m";
			equal(colorize(input), expected);
		});

		test("should handle custom escape character", () => {
			const input = "#rRed#x and #bBlue#x";
			const expected = "\x1b[31mRed\x1b[0m and \x1b[34mBlue\x1b[0m";
			equal(colorize(input, { escapeChar: "#" }), expected);
		});

		test("should handle multiple consecutive color changes", () => {
			const input = "{rRed{bBlue{gGreen{x";
			const expected = "\x1b[31mRed\x1b[34mBlue\x1b[32mGreen\x1b[0m";
			equal(colorize(input), expected);
		});

		test("should handle text without color codes", () => {
			const input = "Plain text without colors";
			equal(colorize(input), input);
		});

		test("should handle empty string", () => {
			equal(colorize(""), "");
		});

		test("should disable background colors when specified", () => {
			const input = "{/rShould not change\x1b[0m";
			equal(colorize(input, { enableBackground: false }), input);
		});
	});

	suite("stripColors", () => {
		test("should remove all color codes", () => {
			const input = "{rRed{x and {bblue{x with {ybackground{x";
			const expected = "Red and blue with background";
			equal(stripColors(input), expected);
		});

		test("should handle custom escape character", () => {
			const input = "#rRed#x and #bBlue#x";
			const expected = "Red and Blue";
			equal(stripColors(input, "#"), expected);
		});

		test("should handle text without color codes", () => {
			const input = "Plain text without colors";
			equal(stripColors(input), input);
		});

		test("should handle empty string", () => {
			equal(stripColors(""), "");
		});
	});
});
