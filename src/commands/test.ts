import { _ } from "../i18n.js";
import { Command } from "../command.js";
import { Colorizer } from "../color.js";
export const COMMAND = new Command(
	/^(?:test|tes|te|t)$/,
	"test",
	"test",
	"Do a test.",
	(character, comment) => {
		const yellow = Colorizer.yellow("This is a yellow string.");
		const crimson = Colorizer.crimson(
			`This is a crimson string with '${yellow}' embeded inside of it.`
		);
		const pink = Colorizer.pink(
			`This is a pink string with '${crimson}' embeded inside of it.`
		);
		const strike = Colorizer.strikeThrough(
			`All this text (${pink}) has a strike through it.`
		);
		character.sendLine(strike);
	}
);
