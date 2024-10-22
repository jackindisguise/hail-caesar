import { Command } from "../command.js";
import {
	TELNET_CODES,
	LETTER_CODES,
	ESCAPE_SIZER,
	Colorizer,
} from "../color.js";
import { padRight, box, BOX_STYLE, padCenter, PAD_SIDE } from "../string.js";
import { EOL } from "../telnet.js";

export const COMMAND = new Command(
	/^(?:colors|color|colo|col|co|c)$/,
	"colors",
	"colors",
	"Show all the colors of the rainbow.",
	(character) => {
		let words = [`{{: ${padCenter("{{", 16, " ", ESCAPE_SIZER)}`];
		for (let key of Object.keys(TELNET_CODES)) {
			const centered = `{${LETTER_CODES[key]}${key}{x`;
			words.push(
				`${LETTER_CODES[key]}: ${padCenter(centered, 16, " ", ESCAPE_SIZER)}`
			);
		}
		let lines = [];
		while (words.length) {
			const line = words.splice(0, 4);
			const formatted: string[] = [];
			line.forEach((value) => {
				formatted.push(padRight(value, 19, " ", ESCAPE_SIZER));
			});
			lines.push(formatted.join(""));
		}
		const msg = box(
			lines,
			80,
			"Colors",
			{
				...BOX_STYLE.STARRED,
				titleHAlign: PAD_SIDE.CENTER,
				borderColor: Colorizer.yellow,
				titleColor: Colorizer.white,
			},
			ESCAPE_SIZER
		);
		character.sendLine(msg.join(EOL));
	}
);
