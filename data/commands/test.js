import { _ } from "../../build/i18n.js";
import { box, BOX_STYLES } from "../../build/string.js";
import { ESCAPE_SIZER, Colorizer } from "../../build/color.js";
export const keyword = "test";
export const syntax = "test";
export const description = "Do a test.";
export const rule = /^(?:test|tes|te|t)$/;
export const script = (character, comment) => {
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
};
