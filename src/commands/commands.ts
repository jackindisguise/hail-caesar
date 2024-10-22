import { t } from "../i18n.js";
import { EOL } from "../telnet.js";
import { Command } from "../command.js";
import { commands } from "../db.js";
import { padCenter, box, BOX_STYLE, PAD_SIDE } from "../string.js";
import { ESCAPE_SIZER, Colorizer } from "../color.js";
export const COMMAND = new Command(
	/^(?:commands|command|comman|comma|comm|com|co|c)$/,
	"commands",
	"commands",
	"Shows all of the commands.",
	(character) => {
		const lines = [];
		let words = [];
		for (let command of commands) words.push(padCenter(command.keyword, 19));
		while (words.length) {
			const three = words.splice(0, 4);
			lines.push(three.join(""));
		}
		const msg = box(
			lines,
			80,
			"Commands",
			{
				...BOX_STYLE.PLAIN,
				titleHAlign: PAD_SIDE.CENTER,
				borderColor: Colorizer.yellow,
				titleColor: Colorizer.white,
			},
			ESCAPE_SIZER
		);
		character.sendLine(msg.join(EOL));
	}
);
