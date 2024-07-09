import { Sizer } from "./string.js";

export const COLOR_ESCAPE = "{";

export const LETTER_CODES: { [key: string]: string } = {
	CLEAR: "x",
	ITALIC: "@",
	UNDERLINE: "#",
	REVERSE: "^",
	STRIKETHROUGH: "-",
	BLACK: "X",
	MAROON: "r",
	CRIMSON: "R",
	GREEN: "g",
	LIME: "G",
	OLIVE: "y",
	YELLOW: "Y",
	NAVY: "b",
	BLUE: "B",
	PURPLE: "p",
	PINK: "P",
	TEAL: "c",
	CYAN: "C",
	SILVER: "w",
	WHITE: "W",
	GREY: "D",
};

export const TELNET_CODES: { [key: string]: string } = {
	CLEAR: "[0m",
	ITALIC: "[3m",
	UNDERLINE: "[4m",
	REVERSE: "[7m",
	STRIKETHROUGH: "[9m",
	BLACK: "[0;30m",
	MAROON: "[0;31m",
	CRIMSON: "[1;31m",
	GREEN: "[0;32m",
	LIME: "[1;32m",
	OLIVE: "[0;33m",
	YELLOW: "[1;33m",
	NAVY: "[0;34m",
	BLUE: "[1;34m",
	PURPLE: "[0;35m",
	PINK: "[1;35m",
	TEAL: "[0;36m",
	CYAN: "[1;36m",
	SILVER: "[0;37m",
	WHITE: "[1;37m",
	GREY: "[1;30m",
};

export const ESCAPE_SIZER: Sizer = {
	open: "{",
	size: (str: string) => {
		const rule = new RegExp(`${COLOR_ESCAPE}(.)`, "g");
		const safe = str.replace(rule, (match, letter) => {
			// escaping the color escape renders the color escape
			if (letter === COLOR_ESCAPE) return COLOR_ESCAPE;
			return "";
		});
		return safe.length;
	},
};

function escape(str: string) {
	return `\x1B${str}`;
}

export function colorize(str: string) {
	const safe = `${colorize}`;
	const rule = new RegExp(`${COLOR_ESCAPE}(.)`, "g");
	let colored = false;
	const colorized = str.replace(
		rule,
		(full: string, letter: string, index: number) => {
			if (letter === COLOR_ESCAPE) return COLOR_ESCAPE;
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

const clearCode = `${COLOR_ESCAPE}${LETTER_CODES.CLEAR}`;

/**
 * Appends a color code to a clear code.
 * This ensures when using colorizeString, all text in the string is the appropriate color.
 */
function overrideClear(str: string, override: string) {
	return str.replaceAll(clearCode, `${clearCode}${override}`);
}

/**
 * Adds color code to string. Automatically overrides clears with the color.
 */
function colorizeString(str: string, letter: string) {
	const colorCode = `${COLOR_ESCAPE}${letter}`;
	return `${colorCode}${overrideClear(str, colorCode)}${clearCode}`;
}

/**
 * These functions accept a string and return a string that can be properly escaped to produce the desired color.
 */
export class Colorizer {
	static clear(str: string) {
		return colorizeString(str, LETTER_CODES.CLEAR);
	}
	static italic(str: string) {
		return colorizeString(str, LETTER_CODES.ITALIC);
	}
	static underline(str: string) {
		return colorizeString(str, LETTER_CODES.UNDERLINE);
	}
	static blink(str: string) {
		return colorizeString(str, LETTER_CODES.BLINK);
	}
	static fastBlink(str: string) {
		return colorizeString(str, LETTER_CODES.FAST_BLINK);
	}
	static reverse(str: string) {
		return colorizeString(str, LETTER_CODES.REVERSE);
	}
	static erase(str: string) {
		return colorizeString(str, LETTER_CODES.ERASE);
	}
	static strikeThrough(str: string) {
		return colorizeString(str, LETTER_CODES.STRIKETHROUGH);
	}
	static doubleUnderline(str: string) {
		return colorizeString(str, LETTER_CODES.DBL_UNDERLINE);
	}
	static black(str: string) {
		return colorizeString(str, LETTER_CODES.BLACK);
	}
	static maroon(str: string) {
		return colorizeString(str, LETTER_CODES.MAROON);
	}
	static green(str: string) {
		return colorizeString(str, LETTER_CODES.GREEN);
	}
	static olive(str: string) {
		return colorizeString(str, LETTER_CODES.OLIVE);
	}
	static navy(str: string) {
		return colorizeString(str, LETTER_CODES.NAVY);
	}
	static purple(str: string) {
		return colorizeString(str, LETTER_CODES.PURPLE);
	}
	static teal(str: string) {
		return colorizeString(str, LETTER_CODES.TEAL);
	}
	static silver(str: string) {
		return colorizeString(str, LETTER_CODES.SILVER);
	}
	static grey(str: string) {
		return colorizeString(str, LETTER_CODES.GREY);
	}
	static crimson(str: string) {
		return colorizeString(str, LETTER_CODES.CRIMSON);
	}
	static lime(str: string) {
		return colorizeString(str, LETTER_CODES.LIME);
	}
	static yellow(str: string) {
		return colorizeString(str, LETTER_CODES.YELLOW);
	}
	static blue(str: string) {
		return colorizeString(str, LETTER_CODES.BLUE);
	}
	static pink(str: string) {
		return colorizeString(str, LETTER_CODES.PINK);
	}
	static cyan(str: string) {
		return colorizeString(str, LETTER_CODES.CYAN);
	}
	static white(str: string) {
		return colorizeString(str, LETTER_CODES.WHITE);
	}
}
