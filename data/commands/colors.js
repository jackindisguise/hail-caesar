import {
	TELNET_CODES,
	LETTER_CODES,
	ESCAPE_SIZER,
	Colorizer,
} from "../../build/color.js";
import { padRight, box, BOX_STYLES, padCenter } from "../../build/string.js";

export const keyword = "colors";
export const syntax = "colors";
export const description = "Show all the colors of the rainbow.";
export const rule = /^(?:colors|color|colo|col|co|c)$/;
export const script = (character) => {
	let words = [];
	for (let key of Object.keys(TELNET_CODES)) {
		const centered = `{${LETTER_CODES[key]}${key}{x`;
		words.push(`${LETTER_CODES[key]}: ${padCenter(centered, 16)}`);
	}
	let lines = [];
	while (words.length) {
		const line = words.splice(0, 4);
		const formatted = [];
		line.forEach((value) => {
			formatted.push(padRight(value, 19, " ", ESCAPE_SIZER));
		});
		lines.push(formatted.join(""));
	}
	const msg = box(
		lines,
		80,
		"Colors",
		{ ...BOX_STYLES.PLAIN, vPadding: 1 },
		ESCAPE_SIZER,
		Colorizer.yellow
	);
	character.sendLine(msg.join("\r\n"));
};
