import { Character } from "../character.js";
import { Command } from "../command.js";
import { _ } from "../i18n.js";

class OOC extends Command {
	protected rule = /^ooc\s*(.+)$/;
	run(character: Character, comment: string) {
		character.sendLine(_("You OOC: {{comment}}", { comment: comment }));
	}
}

export { OOC as default };
