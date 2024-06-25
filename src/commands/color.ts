import { Character } from "../character.js";
import { Command } from "../command.js";
import { _ } from "../i18n.js";
import { TELNET_CODES, LETTER_CODES, ESCAPE_SIZER } from "../color.js";
import { padRight } from "../string.js";

class Colors extends Command {
	protected rule = /^colors\s*$/;
	run(character: Character, comment: string) {
		let words = [];
		for (let key of Object.keys(TELNET_CODES))
			words.push(`{${LETTER_CODES[key]}${key}{x`);
		let lines = [];
		while (words.length) {
			const line = words.splice(0, 6);
			const formatted: string[] = [];
			line.forEach((value) => {
				formatted.push(padRight(value, 16, " ", ESCAPE_SIZER));
			});
			lines.push(formatted.join(" "));
		}
		character.sendLine(lines.join("\r\n"));
	}
}

export { Colors as default };
