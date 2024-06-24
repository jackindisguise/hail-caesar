import { Character } from "../character.js";
import { Command } from "../command.js";
import { _ } from "../i18n.js";
import chalk from "chalk";

chalk.level = 2;

class OOC extends Command {
	protected rule = /^ooc\s*(.+)$/;
	run(character: Character, comment: string) {
		character.sendLine(
			_("You OOC: {{comment}}", { comment: chalk.yellowBright(comment) })
		);
	}
}

export { OOC as default };
