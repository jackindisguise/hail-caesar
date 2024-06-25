import { Character } from "../character.js";
import { Command } from "../command.js";
import { _ } from "../i18n.js";
import { commands } from "../handle.js";

class Commands extends Command {
	protected rule = /^commands\s*$/;
	run(character: Character, comment: string) {
		for (let command of commands) character.sendLine(command.toString());
	}
}

export { Commands as default };
