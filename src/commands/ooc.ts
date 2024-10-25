import { t } from "i18next";
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
				t("You OOC: {{comment}}", { comment: Colorizer.white(comment) })
			)
		);
	}
);
