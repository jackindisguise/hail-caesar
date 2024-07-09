import { _ } from "../i18n.js";
import { Command } from "../command.js";
import { Colorizer } from "../color.js";
export const COMMAND = new Command(
	/^(?:ooc|oo|o)\s+(.+)$/,
	"ooc",
	"ooc <comment>",
	"Speak in the out-of-character channel.",
	(character, comment) => {
		character.sendLine(
			Colorizer.yellow(
				_("You OOC: {{comment}}", { comment: Colorizer.white(comment) })
			)
		);
	}
);
