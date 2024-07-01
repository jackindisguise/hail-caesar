import { Sizer } from "./string.js";

export const COLOR_ESCAPE = "{";

export const LETTER_CODES: { [key: string]: string } = {
	CLEAR: "x",
	ITALIC: "@",
	UNDERLINE: "#",
	BLINK: "$",
	FAST_BLINK: "%",
	REVERSE: "^",
	ERASE: "&",
	STRIKETHROUGH: "-",
	DBL_UNDERLINE: "_",
	BLACK: "X",
	MAROON: "r",
	GREEN: "g",
	OLIVE: "y",
	NAVY: "b",
	PURPLE: "p",
	TEAL: "c",
	SILVER: "w",
	GREY: "D",
	CRIMSON: "R",
	LIME: "G",
	YELLOW: "Y",
	BLUE: "B",
	PINK: "P",
	CYAN: "C",
	WHITE: "W",
};

export const TELNET_CODES: { [key: string]: string } = {
	CLEAR: "[0m",
	ITALIC: "[3m",
	UNDERLINE: "[4m",
	BLINK: "[5m",
	FAST_BLINK: "[6m",
	REVERSE: "[7m",
	ERASE: "[8m",
	STRIKETHROUGH: "[9m",
	DBL_UNDERLINE: "[21m",
	BLACK: "[0;30m",
	MAROON: "[0;31m",
	GREEN: "[0;32m",
	OLIVE: "[0;33m",
	NAVY: "[0;34m",
	PURPLE: "[0;35m",
	TEAL: "[0;36m",
	SILVER: "[0;37m",
	GREY: "[1;30m",
	CRIMSON: "[1;31m",
	LIME: "[1;32m",
	YELLOW: "[1;33m",
	BLUE: "[1;34m",
	PINK: "[1;35m",
	CYAN: "[1;36m",
	WHITE: "[1;37m",
};

export const ESCAPE_SIZER: Sizer = {
	open: "{",
	size: (str: string) => {
		const rule = new RegExp(`${COLOR_ESCAPE}(.)`, "g");
		const safe = str.replace(rule, "");
		return safe.length;
	},
};

export function escape(str: string) {
	return `\x1B${str}`;
}

export function colorize(str: string) {
	const safe = `${colorize}`;
	const rule = new RegExp(`${COLOR_ESCAPE}(.)`, "g");
	let colored = false;
	const colorized = str.replace(
		rule,
		(full: string, letter: string, index: number) => {
			for (let key in LETTER_CODES) {
				if (LETTER_CODES[key] === letter) {
					if (key === "CLEAR") colored = false;
					else colored = true;
					return escape(TELNET_CODES[key]);
				}
			}
			return "";
		}
	);
	if (colored) return `${colorized}${escape(TELNET_CODES.CLEAR)}`; // clear it manually
	return colorized;
}
