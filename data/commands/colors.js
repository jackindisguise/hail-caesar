import { TELNET_CODES, LETTER_CODES, ESCAPE_SIZER } from "../../build/color.js";
import { padRight } from "../../build/string.js";

export const keyword = "colors";
export const syntax = "colors";
export const description = "Show all the colors of the rainbow.";
export const rule = /^colors\s*$/;
export const script = (character) => {
	let words = [];
	for (let key of Object.keys(TELNET_CODES))
		words.push(`{${LETTER_CODES[key]}${key}{x`);
	let lines = [];
	while (words.length) {
		const line = words.splice(0, 6);
		const formatted = [];
		line.forEach((value) => {
			formatted.push(padRight(value, 16, " ", ESCAPE_SIZER));
		});
		lines.push(formatted.join(" "));
	}
	character.sendLine(lines.join("\r\n"));
};
