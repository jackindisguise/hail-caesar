import { Character } from "../character.js";
import { Command } from "../command.js";
import { _ } from "../i18n.js";
import { COLORS } from "../color.js";

class Colors extends Command {
	protected rule = /^colors\s*$/;
	run(character: Character, comment: string) {
		let words = [];
		for (let key of Object.keys(COLORS))
			words.push(`\x1B${COLORS[key]}${key}\x1B[0m`);
		while (words.length) {
			const line = words.splice(0, 5);
			character.sendLine(line.join(" "));
		}
	}
}

export { Colors as default };
