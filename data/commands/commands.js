import { _ } from "../../build/i18n.js";
import { commands } from "../../build/database.js";
import { padCenter, box, BOX_STYLES, PAD_SIDE } from "../../build/string.js";
import { ESCAPE_SIZER, Colorizer } from "../../build/color.js";
export const keyword = "commands";
export const syntax = "commands";
export const description = "Shows all of the commands.";
export const rule = /^(?:commands|command|comman|comma|comm|com|co|c)$/;
export const script = (character) => {
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
		"{WCommands{x",
		{ ...BOX_STYLES.PLAIN, titleHAlign: PAD_SIDE.CENTER, vPadding: 1 },
		ESCAPE_SIZER,
		Colorizer.yellow
	);
	character.sendLine(msg.join("\r\n"));
};
